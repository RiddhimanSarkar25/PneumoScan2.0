import React, { useState, useEffect } from 'react';
import { PatientService, ScanService } from '../services/mockDatabase';
import { mockAiInference } from '../services/mockAI';
import { Patient, Scan, ScanResult, Classification } from '../types';
import { UploadCloud, Check, AlertOctagon, Activity, Clock, FilePlus, ChevronRight } from 'lucide-react';

const UploadAnalyze: React.FC = () => {
  // Mode: 'upload' or 'result'
  const [view, setView] = useState<'upload' | 'result'>('upload');
  
  // Form State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // New Patient State
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('Male');
  
  // Analysis Result State
  const [result, setResult] = useState<ScanResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setPatients(PatientService.getAll());
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddPatient = () => {
    if (!newPatientName || !newPatientAge) return;
    const newPatient: Patient = {
      id: `p${Date.now()}`,
      name: newPatientName,
      age: parseInt(newPatientAge),
      gender: newPatientGender as any,
      medicalHistory: 'None recorded'
    };
    PatientService.add(newPatient);
    setPatients(PatientService.getAll());
    setSelectedPatientId(newPatient.id);
    setIsAddingPatient(false);
    setNewPatientName('');
    setNewPatientAge('');
  };

  const handleAnalyze = () => {
    if (!selectedPatientId || !imageFile) return;

    setAnalyzing(true);
    
    // Simulate AI Processing time
    setTimeout(() => {
      const inferenceResult = mockAiInference(symptoms);
      setResult(inferenceResult);

      // Save to Mock DB
      const patient = patients.find(p => p.id === selectedPatientId);
      if (patient) {
        const newScan: Scan = {
          id: `scan${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          imageFilename: previewUrl || '',
          uploadDate: new Date().toISOString(),
          symptomsAtScan: symptoms,
          result: inferenceResult
        };
        ScanService.add(newScan);
      }

      setAnalyzing(false);
      setView('result');
    }, 1500);
  };

  const resetForm = () => {
    setSymptoms('');
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setView('upload');
  };

  if (view === 'result' && result) {
    return (
      <div className="max-w-6xl mx-auto">
        <button 
            onClick={resetForm}
            className="mb-6 flex items-center text-medical-600 hover:text-medical-800 font-medium"
        >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
            Back to Upload
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Col: Image & Patient Info */}
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Input X-Ray Scan</h3>
                    <div className="aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative group">
                        {previewUrl && (
                            <img src={previewUrl} alt="X-ray" className="object-contain w-full h-full" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <p className="text-white text-sm">Uploaded: {new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Patient Details</h3>
                    {(() => {
                        const p = patients.find(pat => pat.id === selectedPatientId);
                        return p ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Name</span>
                                    <span className="font-semibold text-slate-900">{p.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Age / Gender</span>
                                    <span className="font-semibold text-slate-900">{p.age} / {p.gender}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Reported Symptoms</span>
                                    <span className="font-semibold text-slate-900">{symptoms || "None"}</span>
                                </div>
                            </div>
                        ) : null;
                    })()}
                </div>
            </div>

            {/* Right Col: AI Report */}
            <div className="space-y-6">
                {result.isFlaggedFalseNegative && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm animate-pulse">
                        <div className="flex items-start">
                            <AlertOctagon className="w-8 h-8 text-red-600 mr-4 mt-1" />
                            <div>
                                <h3 className="text-red-800 font-bold text-lg">Potential False Negative Detected</h3>
                                <p className="text-red-700 mt-1">
                                    The AI classified this as "Normal", but reported symptoms (severe, fever, breath) indicate a high risk of Pneumonia. Please review manually.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-medical-700 text-white p-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold">AI Diagnostic Report</h2>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-mono">
                            {(result.confidenceScore * 100).toFixed(1)}% Confidence
                        </span>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {/* Classification */}
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Classification</p>
                            <div className="flex items-center space-x-3">
                                <div className={`w-4 h-12 rounded-full ${
                                    result.classification === Classification.Normal ? 'bg-green-500' :
                                    result.classification === Classification.Bacterial ? 'bg-orange-500' : 'bg-yellow-500'
                                }`}></div>
                                <div>
                                    <span className="text-3xl font-bold text-slate-900 block">{result.classification}</span>
                                    <span className="text-slate-500 text-sm">Pathology Analysis</span>
                                </div>
                            </div>
                        </div>

                        {/* Stage */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Detected Stage</p>
                                <p className="text-lg font-semibold text-slate-800">{result.stage}</p>
                             </div>
                             <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status</p>
                                <p className="text-lg font-semibold text-slate-800">{result.isFlaggedFalseNegative ? 'Requires Review' : 'Verified'}</p>
                             </div>
                        </div>

                        {/* Recommendations */}
                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                                <Activity className="w-5 h-5 text-medical-600 mr-2" />
                                Smart Recommendations
                            </h4>
                            
                            <div className="grid gap-4">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <FilePlus className="w-5 h-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Suggested Medication</p>
                                        <p className="text-slate-600 text-sm mt-1">{result.recommendedMeds}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                                        <Clock className="w-5 h-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Est. Recovery Time</p>
                                        <p className="text-slate-600 text-sm mt-1">{result.estimatedRecovery}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <UploadCloud className="w-6 h-6 mr-3 text-medical-600" />
            Upload New Scan
          </h2>
          <p className="text-slate-500 mt-1 ml-9">Select a patient and upload an X-ray image for AI analysis.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Patient</label>
            {!isAddingPatient ? (
              <div className="flex space-x-2">
                <select 
                  className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
                <button 
                  onClick={() => setIsAddingPatient(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  + New
                </button>
              </div>
            ) : (
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                 <h4 className="font-medium text-slate-800 mb-3">Add New Patient</h4>
                 <div className="grid grid-cols-2 gap-4 mb-3">
                   <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="px-3 py-2 border border-slate-300 rounded-md"
                      value={newPatientName}
                      onChange={e => setNewPatientName(e.target.value)}
                   />
                   <div className="flex space-x-2">
                     <input 
                        type="number" 
                        placeholder="Age" 
                        className="w-20 px-3 py-2 border border-slate-300 rounded-md"
                        value={newPatientAge}
                        onChange={e => setNewPatientAge(e.target.value)}
                     />
                     <select 
                        className="flex-grow px-3 py-2 border border-slate-300 rounded-md"
                        value={newPatientGender}
                        onChange={e => setNewPatientGender(e.target.value)}
                     >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                     </select>
                   </div>
                 </div>
                 <div className="flex space-x-2">
                   <button 
                      onClick={handleAddPatient}
                      className="px-3 py-1.5 bg-medical-600 text-white rounded text-sm font-medium"
                   >
                     Save Patient
                   </button>
                   <button 
                      onClick={() => setIsAddingPatient(false)}
                      className="px-3 py-1.5 text-slate-500 text-sm hover:text-slate-700"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
            )}
          </div>

          {/* Symptoms */}
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Clinical Symptoms</label>
             <textarea
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none h-24 resize-none"
                placeholder="E.g., High fever, shortness of breath, severe chest pain..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
             />
             <p className="text-xs text-slate-500 mt-1">Include keywords like "severe", "fever", or "breath" to test Rule 1 logic.</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">X-Ray Image</label>
            <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${imageFile ? 'border-medical-500 bg-medical-50' : 'border-slate-300 hover:border-medical-400'}`}>
               {!imageFile ? (
                 <>
                   <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                   <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                   <p className="text-xs text-slate-400 mt-1">DICOM, JPEG, PNG supported</p>
                   <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      accept="image/*"
                   />
                 </>
               ) : (
                 <div className="relative w-full h-full flex flex-col items-center">
                    <img src={previewUrl!} alt="Preview" className="h-48 object-contain mb-4 rounded-lg shadow-sm" />
                    <p className="text-sm font-medium text-medical-800">{imageFile.name}</p>
                    <button 
                      onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                      className="text-xs text-red-500 hover:text-red-700 mt-2 underline"
                    >
                      Remove
                    </button>
                 </div>
               )}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleAnalyze}
              disabled={!imageFile || !selectedPatientId || analyzing}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all ${
                !imageFile || !selectedPatientId || analyzing
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-medical-600 hover:bg-medical-700 text-white transform hover:-translate-y-1'
              }`}
            >
              {analyzing ? (
                <>
                  <Activity className="w-6 h-6 animate-spin" />
                  <span>Processing with PneumoScan AI...</span>
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAnalyze;