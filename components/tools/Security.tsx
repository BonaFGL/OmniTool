"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Security = ({ onBack }: { onBack: () => void }) => {
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdOpts, setPwdOpts] = useState({ upper: true, lower: true, num: true, sym: true });
  const [password, setPassword] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);

  const [qrValue, setQrValue] = useState('https://google.com');
  const [qrColor, setQrColor] = useState('#ffffff');

  const generatePassword = () => {
    let charset = "";
    if (pwdOpts.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwdOpts.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (pwdOpts.num) charset += "0123456789";
    if (pwdOpts.sym) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") return;

    let retVal = "";
    for (let i = 0, n = charset.length; i < pwdLength; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);

    let score = 0;
    if (pwdLength > 10) score++;
    if (pwdLength > 14) score++;
    let variety = 0;
    if (pwdOpts.upper) variety++;
    if (pwdOpts.lower) variety++;
    if (pwdOpts.num) variety++;
    if (pwdOpts.sym) variety++;
    if (variety > 2) score++;

    setPwdStrength(score >= 3 ? 2 : score >= 1 ? 1 : 0);
  };

  useEffect(() => {
    generatePassword();
  }, [pwdLength, pwdOpts]);

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Sicurezza & QR</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-emerald-900/10 border-emerald-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-adaptive">Generatore Password</h3>
          </div>
          <div className="bg-[var(--bg-main)] p-6 rounded-2xl relative group overflow-hidden break-all border border-[var(--glass-border)] shadow-inner">
            <p className="text-2xl font-mono text-emerald-500 font-bold">{password}</p>
            <button onClick={() => navigator.clipboard.writeText(password)} className="absolute top-4 right-4 p-2 glass-panel hover:bg-[var(--glass-card-hover)] rounded-lg text-adaptive opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">COPIA</button>
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${pwdStrength === 2 ? 'bg-emerald-500 w-full' : pwdStrength === 1 ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input type="range" min="8" max="64" value={pwdLength} onChange={(e) => setPwdLength(parseInt(e.target.value))} className="flex-1 accent-emerald-500 h-2 bg-[var(--glass-input-bg)] rounded-lg appearance-none cursor-pointer" />
              <span className="min-w-[2.5rem] text-center font-mono text-emerald-500 font-black bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20">{pwdLength}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { id: 'upper', label: 'ABC' }, { id: 'lower', label: 'abc' },
                { id: 'num', label: '123' }, { id: 'sym', label: '#@!' }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 p-3 bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-xl cursor-pointer hover:bg-[var(--glass-card-hover)] transition-colors shadow-sm">
                  <input type="checkbox" checked={(pwdOpts as any)[opt.id]} onChange={(e) => setPwdOpts(p => ({ ...p, [opt.id]: e.target.checked }))} className="w-5 h-5 rounded border-[var(--glass-border)] text-emerald-500 bg-[var(--bg-main)]" />
                  <span className="text-sm font-bold text-adaptive">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={generatePassword} className="mt-auto w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all">RIGENERA</button>
        </section>

        <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-cyan-900/10 border-cyan-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-adaptive">Generatore QR</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-3xl p-6 relative shadow-inner">
            <div className="bg-white p-4 rounded-xl shadow-lg transition-transform hover:scale-105">
              <QRCodeCanvas id="qr-code-canvas" value={qrValue} size={200} fgColor={qrColor === '#ffffff' ? '#000000' : qrColor} bgColor={"#ffffff"} level={"H"} />
            </div>
          </div>
          <div className="space-y-4">
            <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} className="glass-input w-full p-4 rounded-xl shadow-sm text-adaptive" placeholder="https://..." />
            <div className="flex gap-2">
              <button onClick={() => setQrColor('#ffffff')} className={`flex-1 py-3 rounded-lg border transition-all font-bold ${qrColor === '#ffffff' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-adaptive border-[var(--glass-border)] hover:bg-[var(--glass-card-hover)]'}`}>Nero</button>
              <button onClick={() => setQrColor('#0ea5e9')} className={`flex-1 py-3 rounded-lg border transition-all font-bold ${qrColor === '#0ea5e9' ? 'bg-sky-500 text-white border-sky-500' : 'bg-transparent text-sky-500 border-sky-500/20 hover:bg-sky-500/10'}`}>Blu</button>
              <button onClick={() => setQrColor('#db2777')} className={`flex-1 py-3 rounded-lg border transition-all font-bold ${qrColor === '#db2777' ? 'bg-pink-600 text-white border-pink-600' : 'bg-transparent text-pink-600 border-pink-600/20 hover:bg-pink-600/10'}`}>Rosa</button>
            </div>
            <button onClick={downloadQR} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2">SCARICA PNG</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Security;
