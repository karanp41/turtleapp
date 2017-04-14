import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.sax.StartElementListener;
import android.util.Log;












import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caen.RFIDLibrary.CAENRFIDEvent;
import com.caen.RFIDLibrary.CAENRFIDEventListener;
import com.caen.RFIDLibrary.CAENRFIDException;
import com.caen.RFIDLibrary.CAENRFIDLogicalSource;
import com.caen.RFIDLibrary.CAENRFIDLogicalSourceConstants;
import com.caen.RFIDLibrary.CAENRFIDNotify;
import com.caen.RFIDLibrary.CAENRFIDPort;
import com.caen.RFIDLibrary.CAENRFIDProtocol;
import com.caen.RFIDLibrary.CAENRFIDReader;
import com.caen.RFIDLibrary.CAENRFIDTag;
import com.caen.RFIDLibrary.CAENRFIDLogicalSource.InventoryFlag;


public class Caenrfid extends CordovaPlugin implements CAENRFIDEventListener {
	public static final String TAG = "Cool Plugin";

	public CAENRFIDReader reader = null;
	private CallbackContext callbackContext;
	private String address = "";
	private static final UUID myUUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
	private BluetoothDevice deviceBT = null;
	private BluetoothSocket socket = null;
	private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter
			.getDefaultAdapter();
	/**
	 * Constructor.
	 */
	public Caenrfid() {}
	/**
	 * Sets the context of the Command. This can then be used to do things like
	 * get file paths associated with the Activity.
	 *
	 * @param cordova The context of the main Activity.
	 * @param webView The CordovaWebView Cordova is running in.
	 */
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		Log.v(TAG,"Init Caenrfid");
	}
	public boolean execute(final String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("scanSingle".equals(action)){
			String resultString = "";
			Set<BluetoothDevice> pairedDevices = mBluetoothAdapter
					.getBondedDevices();
			// If there are paired devices
			if (pairedDevices.size() > 0) {
				// Loop through paired devices
				for (BluetoothDevice device : pairedDevices) {
					// Add the name and address to an array adapter to show
					// in a ListView
					//					mArrayAdapter.add(device.getName() + "\n"
					//							+ device.getAddress());
					//					mArrayDevice.add(device);
					if (device.getName().contains("qID")){
						Log.d("caenRFID",device.getName() + "\n"
								+ device.getAddress());
						deviceBT = device;
					}
				}
			}
			if (reader == null) {
				reader = new CAENRFIDReader();
			}
			try {
			    socket = deviceBT.createInsecureRfcommSocketToServiceRecord(myUUID);
			}
			catch (  IOException e) {
			    e.printStackTrace();
			}
			try {
				reader.Connect(socket);
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			reader.addCAENRFIDEventListener(this);
			CAENRFIDLogicalSource source = null;
			try {
				source = reader.GetSource("Source_0");
				source.SetReadCycle(0);
				reader.SetPower(1300);
				CAENRFIDTag[] tag = source.InventoryTag();
				if (tag != null){
					byte[] DataToRead;
					// Reading company id to differentiate b/w cradal and logger
					DataToRead = source.ReadTagData_EPC_C1G2(tag[0], (short)2, (short)0, (short)4);
					String companyId = Caenrfid.toHexString(DataToRead);
					if ("00005358".equals(companyId)) {
						Log.d("caenrfid","This is Temp Logger.");
						Log.d("caenrfid","companyId:"+companyId);
						resultString = "foundlogger";
						// resultString = Caenrfid.toHexString(tag[0].GetId());
					}else {
						Log.d("caenrfid","This is Cradal Tag.");
						Log.d("caenrfid","companyId:"+companyId);
						resultString = Caenrfid.toHexString(tag[0].GetId());
					}
				}else{
					resultString = "noTag";
				}
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}





			PluginResult result = new PluginResult(PluginResult.Status.OK,resultString);
			this.callbackContext = callbackContext;
			this.callbackContext.sendPluginResult(result);
			Log.v(TAG,"Caenrfid received: " + action);
			//			reader.InventoryAbort();
			try {
				reader.Disconnect();
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			reader =null;
		} else if ("scanRFID".equals(action)){
			Set<BluetoothDevice> pairedDevices = mBluetoothAdapter
					.getBondedDevices();
			// If there are paired devices
			if (pairedDevices.size() > 0) {
				// Loop through paired devices
				for (BluetoothDevice device : pairedDevices) {
					// Add the name and address to an array adapter to show
					// in a ListView
					//					mArrayAdapter.add(device.getName() + "\n"
					//							+ device.getAddress());
					//					mArrayDevice.add(device);
					if (device.getName().contains("qID")){
						Log.d("caenRFID",device.getName() + "\n"
								+ device.getAddress());
						deviceBT = device;
					}
				}
			}
			reader = new CAENRFIDReader();
			try {
			    socket = deviceBT.createInsecureRfcommSocketToServiceRecord(myUUID);
			}
			catch (IOException e) {
			    e.printStackTrace();
			}
			try {
				reader.Connect(socket);
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			reader.addCAENRFIDEventListener(this);
			CAENRFIDLogicalSource source = null;
			try {
				source = reader.GetSource("Source_0");
				source.SetReadCycle(0);
				reader.SetPower(1300);
				source.SetSelected_EPC_C1G2(CAENRFIDLogicalSourceConstants.EPC_C1G2_All_SELECTED);
				source.EventInventoryTag(new byte[0], (short) 0x0, (short) 0x0,(short)0x07);
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
			result.setKeepCallback(true);
			this.callbackContext = callbackContext;
			this.callbackContext.sendPluginResult(result);
			Log.v(TAG,"Caenrfid received: " + action);
		} else if ("stopRFID".equals(action)){
			reader.InventoryAbort();
			try {
				reader.Disconnect();
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			reader =null;
		} else if ("restartTemp".equals(action)) {

			String rfidToReset = args.getString(1);
			String resultString = "";
			Set<BluetoothDevice> pairedDevices = mBluetoothAdapter
					.getBondedDevices();
			// If there are paired devices
			if (pairedDevices.size() > 0) {
				// Loop through paired devices
				for (BluetoothDevice device : pairedDevices) {
					// Add the name and address to an array adapter to show
					// in a ListView
					//					mArrayAdapter.add(device.getName() + "\n"
					//							+ device.getAddress());
					//					mArrayDevice.add(device);
					if (device.getName().contains("qID")){
						Log.d("caenRFID",device.getName() + "\n"
								+ device.getAddress());
						deviceBT = device;
					}
				}
			}

			reader = new CAENRFIDReader();
			try {
			    socket = deviceBT.createInsecureRfcommSocketToServiceRecord(myUUID);
			  }
			 catch (  IOException e) {
			    e.printStackTrace();
			  }
			try {
				reader.Connect(socket);
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
				//			reader.addCAENRFIDEventListener(this);
			CAENRFIDLogicalSource source = null;
			try {
				int power =reader.GetPower();
				Log.d("caenrfid","Power="+power);
				reader.SetPower(450);
				//				source.SetSelected_EPC_C1G2(CAENRFIDLogicalSourceConstants.EPC_C1G2_All_SELECTED);
				//				reader.SetProtocol(CAENRFIDProtocol.CAENRFID_EPC_C1G1);
				source = reader.GetSource("Source_0");
				CAENRFIDTag[] MyTags = source.InventoryTag();

				if (MyTags != null && MyTags.length > 0) {
					for (int i = 0; i < MyTags.length; i++)
					{
						Log.d("caenrfid","argument 2 : "+rfidToReset);


						resultString = "";
						String EPCString = Caenrfid.toHexString(MyTags[i].GetId());
						Log.d("caenrfid",EPCString);

						// CHECKING IF FOUNDED RFID'S HAS CURRENT SELECTED RFID
						if (EPCString.equals(rfidToReset)) {

							byte[] DataToRead;
							// Read from memory location
							DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)0, (short)2);
							int numsamples = Integer.parseInt(Caenrfid.toHexString(DataToRead),16);
							Log.d("caenrfid","sensors: "+numsamples);
							boolean ext = false;
							if (numsamples==3)
								ext = true;

							int samplesaddress = 34;
							if (ext)
								samplesaddress = 34+8230;
							DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)samplesaddress, (short)2);
							resultString += "Number of samples now deleted: "+Caenrfid.toHexString(DataToRead)+"\n";
							Log.d("caenrfid","Tag read, value = " + Caenrfid.toHexString(DataToRead));

							int startTimeAddress = 30;
							if (ext)
								startTimeAddress = 30+8230;
							DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)startTimeAddress, (short)4);
							String tid = new Date(Long.parseLong(Caenrfid.toHexString(DataToRead), 16)*1000).toString();
							resultString += "Was start time: "+tid+"\n";
							Log.d("caenrfid","Tag read, value = " + Long.parseLong(Caenrfid.toHexString(DataToRead), 16) +","+ Caenrfid.toHexString(DataToRead));
							//Stop logging
							int opAddress = 28;
							if (ext)
								opAddress = 28+8230;
							byte[] DataToWrite = hexStringToByteArray("0000");
							source.WriteTagData_EPC_C1G2(MyTags[i], (short)3, (short)opAddress, (short)2, DataToWrite);
							//Set sampling
							int samplingAddress = 36;
							if (ext)
								samplingAddress = 36+8230;

							int seconds = args.getInt(0);

							Log.d("caenrfid","Sampling = " + seconds);
							DataToWrite = hexStringToByteArray(String.format("%04d", seconds));
							//		DataToWrite = hexStringToByteArray("0708");
							//		DataToWrite = hexStringToByteArray("0008");
							source.WriteTagData_EPC_C1G2(MyTags[i], (short)3, (short)samplingAddress, (short)2, DataToWrite);

							//Read sampling
							DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)samplingAddress, (short)2);
							Log.d("caenrfid","Sampling = " + Caenrfid.toHexString(DataToRead));
							resultString += "Sampling time (seconds): "+Caenrfid.toHexString(DataToRead)+"\n";

							//Set startTime

							long unixTime = System.currentTimeMillis() / 1000L;
							DataToWrite = hexStringToByteArray(Long.toHexString(unixTime));
							String tid2 = new Date(Long.parseLong(Caenrfid.toHexString(DataToWrite), 16)*1000).toString();
							resultString += "Is now start time: "+tid2+"\n";
							Log.d("caenrfid","Written time start = "+ unixTime +","+ Caenrfid.toHexString(DataToWrite));
							source.WriteTagData_EPC_C1G2(MyTags[i], (short)3, (short)startTimeAddress, (short)4, DataToWrite);

							//start logging
							DataToWrite = hexStringToByteArray("03c0");
							source.WriteTagData_EPC_C1G2(MyTags[i], (short)3, (short)opAddress, (short)2, DataToWrite);
							Log.d("caenrfid","tag started again");
							DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)opAddress, (short)2);
							Log.d("caenrfid","Tag read, should be 03c0 for started confirmation = " + Caenrfid.toHexString(DataToRead));
							break;
						}else {
							resultString += "0";
						}
					}
				}
			} catch (CAENRFIDException e) {
				e.printStackTrace();
				try {
					reader.Disconnect();
				} catch (CAENRFIDException e2) {
					// TODO Auto-generated catch block
					e2.printStackTrace();
				}
			}
			try {
				reader.Disconnect();
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			PluginResult result = new PluginResult(PluginResult.Status.OK,resultString);
			this.callbackContext = callbackContext;
			this.callbackContext.sendPluginResult(result);
		} else if ("readTemp".equals(action)) {
			String resultString = "";
			String resultString2= "";
			JSONObject jsonObj = new JSONObject();
			JSONObject rootJson = new JSONObject();
			Set<BluetoothDevice> pairedDevices = mBluetoothAdapter
					.getBondedDevices();
			// If there are paired devices
			if (pairedDevices.size() > 0) {
				// Loop through paired devices
				for (BluetoothDevice device : pairedDevices) {
					// Add the name and address to an array adapter to show
					// in a ListView
					//					mArrayAdapter.add(device.getName() + "\n"
					//							+ device.getAddress());
					//					mArrayDevice.add(device);
					if (device.getName().contains("qID")){
						Log.d("caenRFID",device.getName() + "\n" + device.getAddress());
						deviceBT = device;
					}
				}
			}
			reader = new CAENRFIDReader();
			try {
			    socket = deviceBT.createInsecureRfcommSocketToServiceRecord(myUUID);
			} catch (  IOException e) {
			    e.printStackTrace();
			}
			try {
				reader.Connect(socket);
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				Log.d("caenrfid","Inside catch of socket connection");
				e.printStackTrace();
			}
			reader.addCAENRFIDEventListener(this);
			CAENRFIDLogicalSource source = null;
			try {
				Log.d("caenrfid","Power="+args.getInt(0));
				//Log.d("caenrfid","MyRFID="+args.getInt(1));
				reader.SetPower(args.getInt(0));
				int power = reader.GetPower();
				Log.d("caenrfid","Power="+power);
				source = reader.GetSource("Source_0");
				//source.AddReadPoint("Ant1");
				//				CAENRFIDTag[] MyTags = source.InventoryTag();
				CAENRFIDTag[] MyTags = null;
				int count = 10;
				//				while ((MyTags = source.InventoryTag()) == null && count > 0){
				//					count--;
				//					Log.d("caenrfid","once more");
				//				}
				MyTags = source.InventoryTag();
				Set<String> tagList = new HashSet<String>();
				if ((MyTags = source.InventoryTag()) != null && MyTags.length > 0) {
					Log.d("caenrfid","Lengde: " + MyTags.length);
					for (int i = 0; i < MyTags.length; i++)
					{
						jsonObj = new JSONObject();

						String EPCString = Caenrfid.toHexString(MyTags[i].GetId());
						if (tagList.contains(EPCString))
							continue;
						else
							tagList.add(EPCString);
						resultString = "";
						Log.d("caenrfid",EPCString);
						jsonObj.put("epc",EPCString);



						byte[] DataToRead;
						count = 10;

						DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)0, (short)2);
						int numsamples = Integer.parseInt(Caenrfid.toHexString(DataToRead),16);
						Log.d("caenrfid","sensors: "+numsamples);
						boolean ext = false;
						if (numsamples==3)
							ext = true;


						int samplesAddr = 34;
						if (ext)
							samplesAddr = 34 + 8230;
						while ((DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short) samplesAddr, (short) 2)) == null && count>10) {
							Log.d("caenrfid","Samples: "+Caenrfid.toHexString(DataToRead));
							count--;
							Log.d("caenrfid","once more");
						}
						int samples = (int) Long.parseLong(Caenrfid.toHexString(DataToRead), 16);
						//jsonObj.put("samples",samples);
						Log.d("caenrfid","Tag read, samples = " + Caenrfid.toHexString(DataToRead));

						int startTimeAddr = 30;
						if (ext)
							startTimeAddr = 30 + 8230;
						DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)startTimeAddr, (short)4);
						String tid = new Date(Long.parseLong(Caenrfid.toHexString(DataToRead), 16)*1000).toString();
						long unixTime = Long.parseLong(Caenrfid.toHexString(DataToRead), 16);
						jsonObj.put("startTime",tid);
						Log.d("caenrfid","Tag read, starttime = " +tid);

						int sampleTimeAddr = 36;
						if (ext)
							sampleTimeAddr = 36 + 8230;
						DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)sampleTimeAddr, (short)2);
						int samplingTime = Integer.parseInt(Caenrfid.toHexString(DataToRead),16);
						Log.d("caenrfid","Tag read, samplingtime = " +samplingTime);
						resultString += "[";
						//Math.round(samples/2)
						int sampActual = samples;
						if (samples < 4)
							samples = 4;

						int dataAddr = 46;
						if (ext)
							dataAddr = 46 + 8230;
						int samplecount = 1;
						for (int sampNum=0; sampNum < Math.round(samples/4) ; sampNum++) {
							DataToRead = source.ReadTagData_EPC_C1G2(MyTags[i], (short)3, (short)(dataAddr+(8*sampNum)), (short)8);
							String DataHex = Caenrfid.toHexString(DataToRead);
							String subTemp = DataHex.substring(0, 4);
							String subTemp2 = DataHex.substring(4, 8);
							String subTemp3 = DataHex.substring(8, 12);
							String subTemp4 = DataHex.substring(12, 16);
							double temp = (double)(Long.parseLong(subTemp,16))/10;
							if (temp > 100) {
								Log.d("caenrfid",temp+"");
								temp = (temp ) -6553.5;
							}

							double temp2 = (double)(Long.parseLong(subTemp2,16))/10;
							if (temp2 > 100) {
								temp2 = (temp2  ) -6553.5;
							}
							double temp3 = (double)(Long.parseLong(subTemp3,16))/10;
							if (temp3 > 100) {
								temp3 = (temp3 ) -6553.5;
							}
							double temp4 = (double)(Long.parseLong(subTemp4,16))/10;
							if (temp4 > 100) {
								temp4 = (temp4 ) -6553.5;
							}
							SimpleDateFormat dt = new SimpleDateFormat("y-MM-dd HH:mm:ss");
							String thisTime1 =  dt.format(new Date((unixTime + (sampNum * (samplingTime*4)))*1000))+"";
							String thisTime2 =  dt.format(new Date(((unixTime + ((sampNum+ 2 ) * (samplingTime))))*1000))+"";
							String thisTime3 =  dt.format(new Date(((unixTime + ((sampNum + 3 ) * (samplingTime))))*1000))+"";
							String thisTime4 =  dt.format(new Date(((unixTime + ((sampNum + 4 )* (samplingTime))))*1000))+"";
							if (samplecount>sampActual)
								break;
							samplecount++;
							resultString += "[\""+thisTime1+"\","+temp+"],";
							if (samplecount>sampActual)
								break;
							samplecount++;
							resultString += "[\""+thisTime2+"\","+temp2+"],";
							if (samplecount>sampActual)
								break;
							samplecount++;
							resultString += "[\""+thisTime3+"\","+temp3+"],";
							if (samplecount>sampActual)
								break;
							samplecount++;
							resultString += "[\""+thisTime4+"\","+temp4+"],";
							jsonObj.put((sampNum*2)+1+"",temp+"");
							jsonObj.put((sampNum*2)+2+"",temp2+"");
							jsonObj.put((sampNum*2)+3+"",temp3+"");
							jsonObj.put((sampNum*2)+4+"",temp4+"");
						}
						resultString = resultString.substring(0,resultString.length()-1)+ "]";
						resultString2 +=resultString;
						rootJson.put(EPCString,resultString);

					}
				}
			} catch (CAENRFIDException e) {
				e.printStackTrace();
				try {
					reader.Disconnect();
				} catch (CAENRFIDException e2) {
					// TODO Auto-generated catch block
					e2.printStackTrace();
				}
			}
			try {
				reader.Disconnect();
				Set<String> tagList = new HashSet<String>();
			} catch (CAENRFIDException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			Log.d("caenrfid","resultString: "+resultString);
			PluginResult result = new PluginResult(PluginResult.Status.OK,rootJson.toString());
			//PluginResult result = new PluginResult(PluginResult.Status.OK,resultString2);
			this.callbackContext = callbackContext;
			this.callbackContext.sendPluginResult(result);
		}
		return true;
	}

	public static byte[] hexStringToByteArray(String s) {
	    int len = s.length();
	    byte[] data = new byte[len / 2];
	    for (int i = 0; i < len; i += 2) {
	        data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
	                             + Character.digit(s.charAt(i+1), 16));
	    }
	    return data;
	}

	public void onReaderDetectTag(String tag) {
		Log.d("read_a_tag",tag);
		PluginResult result;
		result = new PluginResult(PluginResult.Status.OK,tag);
		result.setKeepCallback(true);
		//result.setKeepCallback(false);
		if (this.callbackContext != null) {
			this.callbackContext.sendPluginResult(result);
			//			this.callbackContext.success("success:"+tag);
			//			this.callbackContext = null;
		}

	}

	/**
	 * table to convert a nibble to a hex char.
	 */

	static final char[] hexChar = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'A', 'B', 'C', 'D', 'E', 'F' };
	/**
	 * Fast convert a byte array to a hex string with possible leading zero.
	 *
	 * @param b
	 *            array of bytes to convert to string
	 * @return hex representation, two chars per byte.
	 */
	public static String toHexString(byte[] b) {
		StringBuffer sb = new StringBuffer(b.length * 2);
		for (int i = 0; i < b.length; i++) {
			// look up high nibble char
			sb.append(hexChar[(b[i] & 0xf0) >>> 4]);
			// look up low nibble char
			sb.append(hexChar[b[i] & 0x0f]);
		}
		return sb.toString();
	}

	@Override
	public void CAENRFIDTagNotify(CAENRFIDEvent evt) {
		Log.d("caenrfid","notified tag");
		ArrayList<CAENRFIDNotify> tags= (ArrayList<CAENRFIDNotify>)evt.getData();
		for (CAENRFIDNotify tag : tags) {

			/*
			CAENRFIDLogicalSource source = null;
			source = reader.GetSource("Source_0");
			source.SetReadCycle(0);
			reader.SetPower(1300);

			byte[] DataToRead;
			// Reading company id to differentiate b/w cradal and logger
			DataToRead = source.ReadTagData_EPC_C1G2(tag, (short)2, (short)0, (short)4);
			String companyId = Caenrfid.toHexString(DataToRead);
			if ("00005358".equals(companyId)) {
				Log.d("caenrfid","This is Temp Logger.");
				Log.d("caenrfid","companyId:"+companyId);
			}else {
				Log.d("caenrfid","This is Cradal Tag.");
				Log.d("caenrfid","companyId:"+companyId);
			}
			*/

			String id=this.toHexString(tag.getTagID());
			Log.d("caenrfid","tag: "+id);
			onReaderDetectTag(id);

		}
	}

}