import { Copy, Download, X } from 'lucide-react';
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import type { Driver } from '../types';

// --- Interfaces (Mantendo as mesmas) ---



const DriverQRCodeModal = ({ driver, onClose }: { driver: Driver; onClose: () => void }) => {

  // URL Pública que o cliente vai acessar (Ajuste para seu domínio real em produção)
  // Monta a URL fixa. Ex: https://frotagest.com/drivers/qrcode/xyz-123
  const urlPerfil = `https://seusite.com/drivers/qrcode/${driver.publicToken}`;
  
  // Referência para permitir download (opcional)
  const svgRef = useRef(null);

  const downloadQRCode = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
      
        // Cria link falso para baixar
        const downloadLink = document.createElement("a");
        downloadLink.download = `qrcode-${driver.user.name}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col items-center animate-in fade-in zoom-in duration-200">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho do Crachá */}
        <div className="w-full bg-blue-600 p-6 text-center text-white">
          <h2 className="text-xl font-bold">{driver.user.name}</h2>
          <p className="text-blue-100 text-sm mt-1">Motorista Autorizado</p>
        </div>

        {/* Área do QR Code */}
        <div className="p-8 flex flex-col items-center w-full bg-white">
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 mb-4">
            <QRCode
              ref={svgRef}
              value={urlPerfil}
              size={200}
              level="H" // High correction (resiste a riscos no adesivo)
              viewBox={`0 0 256 256`}
            />
          </div>
          
          <div className="text-center space-y-2 mb-6 w-full">
             {/* Info Veículo */}
            {driver.vehicle ? (
               <div className="bg-gray-100 p-3 rounded-lg">
                 <p className="font-bold text-gray-800 text-lg">{driver.vehicle.plate}</p>
                 <p className="text-gray-500 text-sm">{driver.vehicle.model}</p>
               </div>
            ) : (
              <span className="text-yellow-600 text-sm bg-yellow-50 px-3 py-1 rounded-full">Veículo não vinculado</span>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4 bg-gray-50 p-2 rounded border">
               <span className="truncate max-w-[200px]">{urlPerfil}</span>
               <button onClick={() => navigator.clipboard.writeText(urlPerfil)} title="Copiar Link">
                 <Copy size={14} className="hover:text-blue-600 cursor-pointer"/>
               </button>
            </div>
          </div>

          {/* Botão de Download */}
          <button 
            onClick={downloadQRCode}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition w-full justify-center shadow-lg"
          >
            <Download size={20} />
            Baixar Imagem do QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverQRCodeModal;