package handlers;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import java.util.TimeZone;
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
//							try {
//								JSONObject log = new JSONObject();
//								log.put("command", "Test");
//								log.put("timestamp", getTimeStamp());
//								log.put("step", "Step" + Integer.toString(i));
//								log.put("log", "Log " + Integer.toString(i));
//								mSocket.emit(EventDefs.JOB_LOG, log);
//								mSocket.emit(EventDefs.JOB_PROGRESS, i*10);
//							} catch (JSONException e) {
//								// TODO Auto-generated catch block
//								e.printStackTrace();
//							}
//
//						}
//
//						mSocket.emit(EventDefs.JOB_COMPLETE, "Complete");
//					} catch (InterruptedException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//						if(manager!=null) {
//							manager.setBusy(false);
//						}
					try {
						for(int i=0;i<buildSteps.length();i++) {
							JSONObject step = (JSONObject) buildSteps.get(i);
							String args[] = ((String)step.get("arguments")).split("\\s+");
							List<String> commands = new ArrayList<String>();
							commands.add((String)step.get("command"));
							for(int j=0;j<args.length;j++) {
								commands.add(args[j]);
							}
							ProcessBuilder pb = new ProcessBuilder(commands);
							pb.redirectErrorStream(true);
						    pb.directory(new File((String) step.get("commandDir")));
						    String processResult = "";
						    Map<String, String> env = System.getenv();
						    for (String key : env.keySet()) {
						    	pb.environment().put(key, env.get(key));
						    }
						    Process p = pb.start();
						    BufferedReader processOutputReader = new BufferedReader(new InputStreamReader(p.getInputStream()));
					        
						    try {
							    StringJoiner sj = new StringJoiner(System.getProperty("line.separator"));
						        processOutputReader.lines().iterator().forEachRemaining(sj::add);
						        processResult = sj.toString();
						        
						        if(p.waitFor()!=0) {
						        	mSocket.emit(EventDefs.JOB_ERROR, processResult);
					        		return;
						        } else {
						        	JSONObject log = new JSONObject();
									log.put("command", (String)step.get("command") + " " + (String)step.get("arguments"));
									log.put("timestamp", getTimeStamp());
									log.put("step", "Step " + Integer.toString(i));
									log.put("log", processResult);
						        	mSocket.emit(EventDefs.JOB_LOG, log);
						        	mSocket.emit(EventDefs.JOB_PROGRESS, ((i+1)/(double)buildSteps.length())*100);
						        }
						    } catch (InterruptedException e) {
						        e.printStackTrace();
						        mSocket.emit(EventDefs.JOB_ERROR, processResult);
								if(manager!=null) {
									manager.setBusy(false);
								}
						        return;
						    } finally {
							    processOutputReader.close();
						    }
						}
			        	mSocket.emit(EventDefs.JOB_COMPLETE, "Job Complete");

					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						mSocket.emit(EventDefs.JOB_ERROR, e.getMessage());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						mSocket.emit(EventDefs.JOB_ERROR, e.getMessage());
					} finally {
						if(manager!=null) {
							manager.setBusy(false);
						}
					}
					
				}
			
			});

		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			mSocket.emit(EventDefs.JOB_ERROR, e1.getMessage());
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
	
	private String getTimeStamp() {
		TimeZone tz = TimeZone.getTimeZone("UTC");
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"); 
		df.setTimeZone(tz);
		String nowAsISO = df.format(new Date());
		return nowAsISO;
	}

}
