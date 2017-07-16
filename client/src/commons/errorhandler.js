let isDefined = (value, path) => {
    path.split('.').forEach(function(key) {
        value = value && value[key]
    })
    return (typeof value != 'undefined' && value !== null)
}

export const handleError = (error) => {
    if (isDefined(error, 'response.data.message')) {
        toastr.error(error.response.data.message, 'Error!')
    } else {
        //toastr.error(error, 'Error!')
        console.log(error.response)
    }
}