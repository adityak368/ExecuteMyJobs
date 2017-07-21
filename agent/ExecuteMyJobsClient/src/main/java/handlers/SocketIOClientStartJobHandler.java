package handlers;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringJoiner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import client.ConfigLoader;
import client.EventDefs;
import client.JobManager;
import io.socket.client.Socket;

public class SocketIOClientStartJobHandler implements IEventHandler {

	private Socket mSocket;
	private final String mEventId;
	private ConfigLoader mConfigLoader;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientStartJobHandler.class.getName());
	ExecutorService executor = Executors.newFixedThreadPool(1);

	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		JSONObject job = ((JSONObject) args[0]);
		try {
			JSONObject jobData = (JSONObject) job.get("data");
			System.out.println("Starting Job " + jobData.get("type"));
			System.out.println("Job Params:\n" + jobData.toString());
			JSONObject configuration = (JSONObject) jobData.get("configuration");
			JSONArray buildSteps = (JSONArray) configuration.get("buildSteps");
			
			executor.execute(new Runnable() {

				@Override
				public void run() {
					JobManager manager = JobManager.getInstance();
					if(manager!=null) {
						manager.setBusy(true);
					}
//					try {
//						for (int i = 0; i < 10; i++) {
//							Thread.sleep(1000);
//							JSONObject progress = new JSONObject();
//							progress.put("progress", i*10);
//							progress.put("job", args[0]);
//							JSONObject log = new JSONObject();
//							log.put("log", "Progress " + Integer.toString(i));
//							progress.put("job", args[0]);
//							mSocket.emit(EventDefs.JOB_LOG, log);
//							mSocket.emit(EventDefs.JOB_PROGRESS, progress);
//
//						}
//
//						JSONObject completed = new JSONObject();
//						completed.put("id", mConfigLoader.getName());
//						mSocket.emit(EventDefs.JOB_COMPLETE, completed);
//					} catch (InterruptedException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					} catch (JSONException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}

					try {
						for(int i=0;i<buildSteps.length();i++) {
							JSONObject step = (JSONObject) buildSteps.get(i);
							ProcessBuilder pb = new ProcessBuilder((String)step.get("command"), (String)step.get("arguments"));
						    pb.directory(new File((String) step.get("commandDir")));
						    String processResult = "";
						    String processError = "";
						    
						    Process p = pb.start();
						    BufferedReader processOutputReader = new BufferedReader(new InputStreamReader(p.getInputStream()));
						    BufferedReader processErrorReader = new BufferedReader(new InputStreamReader(p.getErrorStream()));
					        
						    try {
							    StringJoiner sj = new StringJoiner(System.getProperty("line.separator"));
						        processOutputReader.lines().iterator().forEachRemaining(sj::add);
						        processResult = sj.toString();
						        
							    StringJoiner sjerror = new StringJoiner(System.getProperty("line.separator"));
							    processErrorReader.lines().iterator().forEachRemaining(sjerror::add);
							    processError = sjerror.toString();
						        
						        if(p.waitFor()!=0) {
						        	mSocket.emit(EventDefs.JOB_ERROR, processError);
						        	break;
						        } else {
						        	mSocket.emit(EventDefs.JOB_LOG, processResult);
						        	mSocket.emit(EventDefs.JOB_PROGRESS, (i+1)/buildSteps.length());
						        }
						    } catch (InterruptedException e) {
						        e.printStackTrace();
						        System.out.println(e.getMessage());
						        System.out.println(processError);
						        mSocket.emit(EventDefs.JOB_ERROR, processError);
						        break;
						    }
						    processOutputReader.close();
						    processErrorReader.close();
						}
			        	mSocket.emit(EventDefs.JOB_COMPLETE, "Job Complete");
						if(manager!=null) {
							manager.setBusy(false);
						}
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						mSocket.emit(EventDefs.JOB_ERROR, "Could Not Parse JSON when executing job");
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						mSocket.emit(EventDefs.JOB_ERROR, "IO Exception when executing job");
					}
				}
			});

		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}

	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub

	}

	public SocketIOClientStartJobHandler(Socket socket, ConfigLoader configLoader, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
		this.mConfigLoader = configLoader;
	}

}
