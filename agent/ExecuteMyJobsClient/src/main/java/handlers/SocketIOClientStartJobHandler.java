package handlers;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

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

	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		JSONObject job = ((JSONObject) args[0]);
		try {
			System.out.println("Starting Job " + job.get("type"));
			System.out.println("Job Params:\n" + job.get("data").toString());
			ExecutorService ser = Executors.newFixedThreadPool(1);
			ser.execute(new Runnable() {

				@Override
				public void run() {
					JobManager manager = JobManager.getInstance();
					if(manager!=null) {
						manager.setBusy(true);
					}
					try {
						for (int i = 0; i < 10; i++) {
							Thread.sleep(1000);
							JSONObject progress = new JSONObject();
							progress.put("progress", i*10);
							progress.put("job", args[0]);
							JSONObject log = new JSONObject();
							log.put("log", "Progress " + Integer.toString(i));
							progress.put("job", args[0]);
							mSocket.emit(EventDefs.JOB_LOG, log);
							mSocket.emit(EventDefs.JOB_PROGRESS, progress);

						}

						JSONObject completed = new JSONObject();
						completed.put("id", mConfigLoader.getName());
						mSocket.emit(EventDefs.JOB_COMPLETE, completed);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if(manager!=null) {
						manager.setBusy(false);
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
