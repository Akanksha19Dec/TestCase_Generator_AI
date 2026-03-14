import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [provider, setProvider] = useState('Ollama');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider, prompt })
      });
      const data = await response.json();
      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput('Error: ' + data.error);
      }
    } catch (err: any) {
      setOutput('Failed to connect to backend: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
            QA CaseForge
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-all shadow-sm cursor-pointer"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="Ollama">Ollama (Local)</option>
            <option value="LM Studio">LM Studio (Local)</option>
            <option value="OpenAI">OpenAI (Remote)</option>
            <option value="Claude">Claude (Remote)</option>
            <option value="Gemini">Gemini (Remote)</option>
            <option value="Grok">Grok (Remote)</option>
          </select>
          <button className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-lg border border-gray-700 transition-colors cursor-pointer group tooltip">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        {/* Left Side: Input */}
        <div className="flex-1 p-6 flex flex-col gap-4 border-r border-gray-800 relative z-10 w-full lg:w-1/2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Jira Requirements / Prompt
            </h2>
          </div>
          <div className="flex-1 rounded-xl bg-gray-900 border border-gray-700 shadow-inner overflow-hidden flex flex-col transition-all hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <textarea
              className="flex-1 w-full bg-transparent p-4 outline-none resize-none text-gray-300 placeholder-gray-600 font-mono text-sm"
              placeholder="Paste your Jira user story, acceptance criteria, or requirements here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex justify-center items-center gap-2 group"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Jira Test Cases...
              </>
            ) : (
              <>
                Generate Scenarios
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Output */}
        <div className="flex-1 p-6 flex flex-col gap-4 bg-gray-900/40 relative z-10 w-full lg:w-1/2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Generated Jira Format Cases
            </h2>
            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-900/50" onClick={() => { }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Copy
            </button>
          </div>
          <div className="flex-1 rounded-xl bg-gray-950 border border-gray-800 shadow-inner overflow-hidden flex flex-col relative group">
            {output ? (
              <div className="flex-1 w-full bg-transparent p-6 outline-none text-gray-300 font-mono text-sm overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {output}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg border border-gray-800">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <p>Awaiting payload processing...<br />Test cases will appear here in detailed Jira layout.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
