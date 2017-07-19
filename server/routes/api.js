var express = require('express')
var router = express.Router()
var Project = require('../models/Project')
var Configuration = require('../models/Configuration')
var Agent = require('../models/Agent')
var BuildStep = require('../models/BuildStep')
var lib = require('../lib/util')
var JobManager = require('../jobs/jobManager')
var mongoose = require('mongoose')

router.route('/projects').get(function(req, res) {

    Project.find({},lib.excludeVersion()).populate('configurations', lib.excludeVersion()).exec(function (err, projects) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json(projects)
    })

}).post(function(req,res) {

    var project = new Project({
        name : req.body.name.trim(),
        description : req.body.description.trim(),
    })
    project.save(function (err) {
        if (err) {
            res.status(500).json({message :err.message})
            return
        }
        res.json({message:'success'})
    })

})


router.route('/projects/:projectName').delete(function(req,res) {

    Project.findOne({name : req.params.projectName.trim()},function(err,project) {
        if (err) {
            res.status(500).json({message :err.message})
            return
        }
        project.remove(function (err) {
            if (err) {
                res.status(500).json({message :err.message})
                return
            }
            res.json({message:'success'})
        })
    })
})

router.route('/configurations').get(function(req, res) {
    Configuration.find({}, function (err, configurations) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json(configurations)
    }).select('-__v')
}).post(function(req,res) {

    if(req.body.projectname) {
        Project.findOne({name: req.body.projectname.trim()}, function (err, project) {
            if (err) {
                res.status(500).json({message: err.message})
                return
            }
            if(!project) {
                res.status(500).json({message: 'No Projects exist by that name'})
                return
            }
            var configuration = new Configuration({
                name: req.body.name.trim(),
                description: req.body.description.trim()
            })
            configuration.save(function (err) {
                if (err) {
                    res.status(500).json({message: err.message})
                    return
                }
                project.configurations.push(configuration)
                project.save(function (err) {
                    if (err) {
                        res.status(500).json(err.message)
                        return
                    }
                    res.json({message: 'success'})

                })
            })
        }).select('-__v')
    } else {
        res.json({message : 'Please provide a project name'})
    }

})

router.route('/configurations/:configuration').get(function(req, res) {

    Configuration.findOne({name:req.params.configuration},lib.excludeVersion()).populate('buildSteps', lib.excludeVersion()).exec(function (err, configuration) {

        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        if(!configuration) {
            res.status(500).json({message:'Could Not Find Configuration!'})
            return
        }
        res.json(configuration)
    })

}).put(function(req,res) {

    Configuration.findOneAndUpdate({name:req.params.configuration},req.body, {upsert:true},function (err, agent) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json({message:'Suceessfully Updated Configuration'})
    })

}).delete(function(req,res) {

    Configuration.findOne({name : req.params.configuration.trim()},function(err,config) {
        if (err) {
            res.status(500).json({message :err.message})
            return
        }
        config.remove(function (err) {
            if (err) {
                res.status(500).json({message :err.message})
                return
            }
            res.json({message:'success'})
        })
    })
})

router.route('/configurations/:configuration/agents').get(function(req, res) {

    Configuration.findOne({name:req.params.configuration},lib.excludeVersion(), function (err, configuration) {

        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        if(!configuration) {
            res.status(500).json({message:'Could Not Find Configuration!'})
            return
        }
        
        const cleanedConfig = configuration.agentFilter.map(function(filter) {
            return { k:filter.k, v:filter.v}
        })

        Agent.aggregate([ {$match : {isConnected : true, isAuthorized : true, isEnabled : true}}, 
            { '$project' : {'os' : 1,'name' : 1,'env' : 1,'attributes' : 1, 'version':1, description : 1 }},
            {'$project' : { 'otherAttributes' : { 'os' : '$os','name' : '$name','version': '$version' }, 'env' : 1,  'attributes':1, name: 1, description: 1  } },
            {'$project' : { 'allattributes' : { '$setUnion' : [ {'$objectToArray' :  '$env'}, {'$objectToArray' :  '$attributes'}, {'$objectToArray' :  '$otherAttributes'}]}, name: 1, description: 1 } },
            { $project: { isCompatible: { $setIsSubset: [ cleanedConfig, '$allattributes' ] }, name: 1, description: 1 } },
            { $match : { isCompatible : true } }
        ], function (err, agents) {
            if(err) {
                console.log(err)
                res.status(500).json({message:err.message})
                return
            }

            res.json(agents)
        })
    })

})

router.route('/configurations/:configuration/buildsteps').get(function(req, res) {

    Configuration.findOne({name:req.params.configuration},{buildSteps:1}).populate('buildSteps', lib.excludeVersion()).exec(function (err, configuration) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        if(!configuration) {
            res.status(500).json({message:'Could Not Find Configuration!'})
            return
        }
        res.json(configuration)
    })

}).post(function(req,res) {
    var newBuildStep = new BuildStep(req.body)
    newBuildStep.save(function (err) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        Configuration.findOneAndUpdate({name:req.params.configuration},{ '$push': { buildSteps: newBuildStep } }, function (err, agent) {
            if(err) {
                res.status(500).json({message:err.message})
                return
            }
            res.json({message:'Successfull Addition of Build Step'})
        })
    })

})

router.route('/configurations/:configuration/buildsteps/:stepid').delete(function(req,res) {

    BuildStep.findOne({_id:req.params.stepid},function (err, step) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        step.remove(function (err) {
            if (err) {
                res.status(500).json({message :err.message})
                return
            }
            res.json({message:'Successfully Removed Build Step'})
        })
    })
})

router.route('/configurations/:configuration/agentfilter').get(function(req, res) {

    Configuration.findOne({name:req.params.configuration},{agentFilter:1}).exec(function (err, configuration) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        if(!configuration) {
            res.status(500).json({message:'Could Not Find Configuration!'})
            return
        }
        res.json(configuration)
    })

}).post(function(req,res) {

    Configuration.findOneAndUpdate({name:req.params.configuration},{ '$push': { agentFilter: req.body } }, function (err, configuration) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json({message:'Successfull Addition of Agent Filter'})
    })

}).delete(function(req,res) {

    Configuration.findOneAndUpdate({name:req.params.configuration},{ '$pull' : { 'agentFilter' : { '_id' :  mongoose.Types.ObjectId(req.query._id) } } }, function (err, configuration) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }

        res.json({message:'Successfull Deletion of Agent Filter'})
    })
})


router.route('/agents').get(function(req, res) {

    Agent.find({}, function (err, agents) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json(agents)
    }).select('-__v')

}).post(function(req,res) {
    if(req.body.agent) {
        var agent = new Agent(req.body.agent)
        agent.save(function (err) {
            if (err) {
                res.status(500).json({message: err.message})
                return
            }
            res.json({message: 'success'})
        })
    } else {
        res.json({message: 'No Agent Found!'})
    }
})

router.route('/agents/count').get(function(req, res) {
    Agent.count({isAuthorized:true}, function(err, count){
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json({connectedAgents : count})
    })
})

router.route('/agents/:agent').get(function(req, res) {

    Agent.findOne({name:req.params.agent},function (err, agent) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        if(!agent) {
            res.status(500).json({message:'Could Not Find Agent!'})
            return
        }
        res.json(agent)
    }).select('-__v')

}).put(function (req,res) {
    Agent.findOneAndUpdate({name:req.params.agent},req.body, function (err, agent) {
        if(err) {
            res.status(500).json({message:err.message})
            return
        }
        res.json({message:'Suceessfully Updated Agent'})
    })
})

router.route('/jobs').post(function(req, res) {
    JobManager.createJob({
        type : req.body.configuration.name,
        configuration : req.body.configuration,
        agent : req.body.agent
    }, function(err, jobId) {
        if (err) {
            res.status(500).json({message :err.message})
            return
        }
        res.json({message:'Job Added Successfully'}) 
    })
})



router.route('/*', function(req,res) {
    res.json({'message':'Invalid Api call'})
})

module.exports = router
