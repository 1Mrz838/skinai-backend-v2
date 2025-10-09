import React, { useState, useRef } from 'react';
import { Upload, Camera, Zap, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const mockDiseases = [
    {
      name: "Actinic Keratosis",
      confidence: 89,
      description: "Precancerous skin growth caused by sun damage. Appears as rough, scaly patches.",
      severity: "moderate",
      treatment: "Topical medications, cryotherapy, or surgical removal."
    },
    {
      name: "Basal Cell Carcinoma",
      confidence: 76,
      description: "Most common type of skin cancer. Appears as pearly bumps or sores that don't heal.",
      severity: "serious",
      treatment: "Surgical excision, Mohs surgery, or topical treatments."
    },
    {
      name: "Benign Keratosis",
      confidence: 65,
      description: "Non-cancerous skin growth. Appears as waxy, stuck-on lesions.",
      severity: "mild",
      treatment: "Usually no treatment needed unless for cosmetic reasons."
    },
    {
      name: "Dermatofibroma",
      confidence: 58,
      description: "Benign skin growth. Appears as firm, round bumps that are reddish-brown.",
      severity: "mild",
      treatment: "Generally harmless; removal only if causing discomfort."
    },
    {
      name: "Melanoma",
      confidence: 42,
      description: "Most serious type of skin cancer. Can appear as irregular moles or new dark spots.",
      severity: "critical",
      treatment: "Immediate surgical removal and possible additional therapies."
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const topPrediction = mockDiseases[0];
    setAnalysisResult({
      primary: topPrediction,
      alternatives: mockDiseases.slice(1, 4),
      timestamp: new Date().toLocaleString()
    });
    
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'serious': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SkinAI Diagnostic</h1>
              <p className="text-gray-600">AI-powered skin disease identification</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Skin Image</h2>
              
              {!selectedImage ? (
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG, or GIF (max 10MB)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Uploaded skin image" 
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={triggerFileInput}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Change Image</span>
                    </button>
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Analyze</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Information Panel */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Upload a clear, well-lit photo of the skin condition</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Our AI analyzes the image using advanced deep learning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Get instant results with confidence scores and recommendations</span>
                </li>
              </ul>
              <p className="text-sm text-blue-200 mt-4">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                This tool provides preliminary analysis only. Always consult a dermatologist for proper diagnosis.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
              
              {isAnalyzing ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  {/* Primary Result */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{analysisResult.primary.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.primary.severity)}`}>
                        {analysisResult.primary.severity.charAt(0).toUpperCase() + analysisResult.primary.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{analysisResult.primary.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Confidence: {analysisResult.primary.confidence}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                          style={{ width: `${analysisResult.primary.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recommended Treatment</h4>
                    <p className="text-blue-800 text-sm">{analysisResult.primary.treatment}</p>
                  </div>

                  {/* Alternative Possibilities */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Other Possibilities</h4>
                    <div className="space-y-3">
                      {analysisResult.alternatives.map((disease, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{disease.name}</p>
                            <p className="text-sm text-gray-600">{disease.confidence}% confidence</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                            {disease.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 pt-4 border-t">
                    Analyzed on {analysisResult.timestamp}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Upload an image and click "Analyze" to get AI-powered results</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Important Disclaimer</h4>
                  <p className="text-yellow-700 text-sm">
                    This AI tool provides preliminary analysis only and should not replace professional medical advice. 
                    Always consult with a qualified dermatologist for accurate diagnosis and treatment recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}