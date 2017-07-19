package client;

import java.util.Map;
import java.util.UUID;

import org.json.JSONException;
import org.json.JSONObject;

public class Utils {
	
	public static String generateUUID() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}
	
	public static JSONObject getEnv() {
		Map<String, String> env = System.getenv();
		JSONObject envJson = new JSONObject();
        for (String envName : env.keySet()) {
        	try {
				envJson.put(envName, env.get(envName));
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
        return envJson;
	}
}
