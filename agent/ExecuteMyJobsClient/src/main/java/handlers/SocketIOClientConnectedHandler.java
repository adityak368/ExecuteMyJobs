package handlers;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

import org.json.JSONException;
import org.json.JSONObject;

import client.ConfigLoader;
import client.Constants;
import client.EventDefs;
import client.Utils;
import io.socket.client.Socket;

public class SocketIOClientConnectedHandler implements IEventHandler{

	
	private Socket mSocket;
	private final String mEventId;
	private ConfigLoader mConfigLoader;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientConnectedHandler.class.getName());
	
	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		mLogger.info("Agent Connected!");
		JSONObject identification = getIdentification(mConfigLoader);
		if(identification==null) {
			mLogger.severe("Could not parse identification");
			mSocket.disconnect();
			System.exit(1);
			
		} else
			mSocket.emit(EventDefs.IDENTIFICATION, identification);
		
		
	}

	public SocketIOClientConnectedHandler(Socket socket, ConfigLoader configsLoader, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
		this.mConfigLoader = configsLoader;
	}

	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub
		mSocket.emit(mEventId, obj);
	}
	
	public JSONObject getIdentification(ConfigLoader configsLoader) {
		JSONObject id = new JSONObject();
		try {
			id.put("name", configsLoader.getName());
			id.put("os", System.getProperty("os.name") + " " + System.getProperty("os.version") + " " + System.getProperty("os.arch"));
			id.put("version", Constants.CLIENT_VERSION);
			id.put("description", configsLoader.getDescription());
			id.put("attributes", configsLoader.getAttributesAsJSON());
			id.put("env",Utils.getEnv());
			mLogger.info("Sending Agent Identification...");
			return id;
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return null;
	}
}
