package handlers;

import java.util.logging.Logger;

import org.json.JSONException;
import org.json.JSONObject;

import client.ConfigLoader;
import client.JobManager;
import io.socket.client.Socket;

public class SocketIOClientStatusHandler implements IEventHandler {


	private Socket mSocket;
	private final String mEventId;
	private ConfigLoader mConfigLoader;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientStatusHandler.class.getName());
	
	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		JobManager manager = JobManager.getInstance();
		if(manager!=null) {
			try {
				JSONObject status = new JSONObject();
				if(manager.isBusy()) {
					status.put("isBusy", true);
				} else {
					status.put("isBusy", false);
				}
				emitMsg(status);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
				
		}
	}

	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub
		mSocket.emit(mEventId,obj);
	}

	public SocketIOClientStatusHandler(Socket socket, ConfigLoader configLoader, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
		this.mConfigLoader = configLoader;
	}
}
