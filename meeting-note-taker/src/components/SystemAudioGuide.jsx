import React, { useState, useEffect } from "react";

/**
 * A component that provides detailed OS-specific instructions for capturing system audio
 */
export default function SystemAudioGuide() {
  const [operatingSystem, setOperatingSystem] = useState("windows");
  
  // Detect OS on component mount
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) setOperatingSystem("windows");
    else if (userAgent.indexOf("Mac") !== -1) setOperatingSystem("mac");
    else if (userAgent.indexOf("Linux") !== -1) setOperatingSystem("linux");
    else setOperatingSystem("other");
  }, []);
  
  return (
    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-4">
      <h3 className="font-medium text-yellow-800 mb-3">System Audio Setup Guide</h3>
      
      {/* OS Selection Tabs */}
      <div className="flex border-b border-yellow-200 mb-4">
        <button
          className={`px-3 py-2 text-sm font-medium ${
            operatingSystem === "windows" 
              ? "border-b-2 border-yellow-500 text-yellow-800" 
              : "text-yellow-600 hover:text-yellow-800"
          }`}
          onClick={() => setOperatingSystem("windows")}
        >
          Windows
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium ${
            operatingSystem === "mac" 
              ? "border-b-2 border-yellow-500 text-yellow-800" 
              : "text-yellow-600 hover:text-yellow-800"
          }`}
          onClick={() => setOperatingSystem("mac")}
        >
          Mac
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium ${
            operatingSystem === "linux" 
              ? "border-b-2 border-yellow-500 text-yellow-800" 
              : "text-yellow-600 hover:text-yellow-800"
          }`}
          onClick={() => setOperatingSystem("linux")}
        >
          Linux
        </button>
      </div>
      
      {/* Windows Instructions */}
      {operatingSystem === "windows" && (
        <div className="space-y-3 text-sm text-gray-700">
          <p className="font-medium">To capture system audio on Windows:</p>
          
          <div className="bg-white p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Method 1: Using Stereo Mix (Recommended)</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Right-click the speaker icon in your taskbar and select "Open Sound settings"</li>
              <li>Click "Sound Control Panel" on the right side</li>
              <li>Go to the "Recording" tab</li>
              <li>Right-click in the empty area and check "Show Disabled Devices"</li>
              <li>Look for "Stereo Mix" - right-click it and select "Enable"</li>
              <li>Right-click "Stereo Mix" again and select "Set as Default Device"</li>
              <li>Click OK to save changes</li>
              <li>Now use the "Microphone" option in our app (it will use Stereo Mix)</li>
            </ol>
            <p className="mt-2 text-yellow-700 italic">Note: If you don't see Stereo Mix, your sound card may not support it. Try Method 2 instead.</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Method 2: Using Virtual Audio Cable</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Download and install <a href="https://vb-audio.com/Cable/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">VB-Cable</a> (free virtual audio cable)</li>
              <li>Restart your computer after installation</li>
              <li>Right-click the speaker icon in your taskbar and select "Open Sound settings"</li>
              <li>Under "Output", select your normal speakers/headphones</li>
              <li>Under "Input", select "CABLE Output"</li>
              <li>Open the Sound Control Panel</li>
              <li>Go to the "Recording" tab, right-click "CABLE Output" and set as Default Device</li>
              <li>Go to the "Playback" tab, right-click "CABLE Input" and select "Properties"</li>
              <li>Go to the "Listen" tab, check "Listen to this device" and select your speakers</li>
              <li>Click OK to save changes</li>
              <li>Now use the "Microphone" option in our app (it will use the virtual cable)</li>
            </ol>
          </div>
        </div>
      )}
      
      {/* Mac Instructions */}
      {operatingSystem === "mac" && (
        <div className="space-y-3 text-sm text-gray-700">
          <p className="font-medium">To capture system audio on Mac:</p>
          
          <div className="bg-white p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Using BlackHole (Free)</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Download and install <a href="https://existential.audio/blackhole/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">BlackHole</a> (free virtual audio driver)</li>
              <li>Open "Audio MIDI Setup" (search for it in Spotlight)</li>
              <li>Click the "+" button in the bottom left and select "Create Multi-Output Device"</li>
              <li>Check both your regular output device and "BlackHole 2ch"</li>
              <li>Select the new Multi-Output Device as your system output (from the volume control in the menu bar)</li>
              <li>In our app, when selecting the microphone input, choose "BlackHole 2ch"</li>
            </ol>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Using Loopback (Paid)</h4>
            <p>For a more user-friendly solution, <a href="https://rogueamoeba.com/loopback/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Loopback</a> ($99) provides an excellent interface for routing audio.</p>
          </div>
        </div>
      )}
      
      {/* Linux Instructions */}
      {operatingSystem === "linux" && (
        <div className="space-y-3 text-sm text-gray-700">
          <p className="font-medium">To capture system audio on Linux:</p>
          
          <div className="bg-white p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Using PulseAudio</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Install PulseAudio Volume Control: <code className="bg-gray-100 px-1 rounded">sudo apt install pavucontrol</code></li>
              <li>Open Terminal and create a null sink: <code className="bg-gray-100 px-1 rounded">pactl load-module module-null-sink sink_name=virtual-sink sink_properties=device.description=VirtualOutput</code></li>
              <li>Create a loopback from your speakers to the virtual sink: <code className="bg-gray-100 px-1 rounded">pactl load-module module-loopback source=virtual-sink.monitor</code></li>
              <li>Open PulseAudio Volume Control</li>
              <li>Go to the "Output Devices" tab and make sure your normal speakers are selected</li>
              <li>Go to the "Recording" tab</li>
              <li>For any application playing audio, change its output to "VirtualOutput"</li>
              <li>In our app, select "Monitor of VirtualOutput" as the microphone input</li>
            </ol>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">After setting up system audio routing:</p>
        <ol className="list-decimal pl-5 mt-1 space-y-1">
          <li>Use the "Microphone" option in our app (it will now capture system audio)</li>
          <li>Start playing your meeting audio or YouTube video</li>
          <li>Click "Start" in the Speech Recognition section</li>
          <li>When done, remember to restore your original audio settings</li>
        </ol>
      </div>
    </div>
  );
}
