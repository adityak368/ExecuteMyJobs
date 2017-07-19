package client;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;
import java.util.logging.Logger;

import org.json.JSONException;
import org.json.JSONObject;

public class ConfigLoader {

	private static final Logger mLogger = Logger.getLogger(ConfigLoader.class.getName());
	Properties prop;
	
	public ConfigLoader() {
		// TODO Auto-generated constructor stub
		prop = new Properties();
	}
	
	public boolean loadConfigs() {
		
		File configFile = new File(Constants.CONFIG_FILE);
		if(!configFile.exists())
			writeDefaultConfigs();
		
		InputStream input = null;

		try {

			input = new FileInputStream(Constants.CONFIG_FILE);
			// load a properties file
			prop.load(input);
			validateMinimumRequiredConfig();
			
		} catch (IOException ex) {
			ex.printStackTrace();
			mLogger.severe(ex.getMessage());
			return false;
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
					mLogger.severe(e.getMessage());
				}
			}
		}
		return true;
	}
			
	private void validateMinimumRequiredConfig() {
		// TODO Auto-generated method stub
		if(prop.getProperty("name")==null ) {
			mLogger.severe("Please set a name for the agent");
			System.exit(1);
		}
		else if(prop.getProperty("description")==null) {
			mLogger.severe("Please set a description for the agent");
			System.exit(1);
		} else if( prop.getProperty(Constants.PASSWORD)==null) {
			mLogger.severe("Please set a password for the agent");
			System.exit(1);
		}
	}

	private void writeDefaultConfigs() {
		OutputStream output = null;

		try {

			output = new FileOutputStream(Constants.CONFIG_FILE);

			// set the properties value
			String Id = Utils.generateUUID();
			prop.setProperty("name", Id);
			prop.setProperty("description", "This is the agent with Id " + Id);
			prop.setProperty(Constants.PASSWORD, "ExecuteMyJobsAgent");

			// save properties to project root folder
			prop.store(output, null);
			
		} catch (IOException io) {
			io.printStackTrace();
			mLogger.severe(io.getMessage());
		} finally {
			if (output != null) {
				try {
					output.close();
				} catch (IOException e) {
					e.printStackTrace();
					mLogger.severe(e.getMessage());
				}
			}

		}
	}
	
	public String getProperty(String key) {
		return prop.getProperty(key);
	}
	
	public Properties getAllProperties() {
		return prop;
	}
	
	public String getName() {
		return prop.getProperty("name");
	}
	
	public String getDescription() {
		return prop.getProperty("description");
	}
	
	public String getPassword() {
		return prop.getProperty(Constants.PASSWORD);
	}
	
	public Properties getAttributes() {
		Properties props = new Properties();
		for(String key : props.stringPropertyNames()) {
			if(!key.equals("name") && !key.equals("description") && !key.equals(Constants.PASSWORD)) {
				String value = prop.getProperty(key);
				props.setProperty(key, value);
			}
		}
		return props;
	}
	
	public JSONObject getAttributesAsJSON() {
		JSONObject attrs = new JSONObject();
		for(String key : prop.stringPropertyNames()) {
			
			if(!key.equals("name") && !key.equals("description") && !key.equals(Constants.PASSWORD)) {
				
				String value = prop.getProperty(key);
				try {
					attrs.put(key, value);
				} catch (JSONException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
					mLogger.severe(e1.getMessage());
				}
			}
		}
		return attrs;
	}
}
