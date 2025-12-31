import { useRef } from 'react';
import QRCode from 'react-qr-code';

interface DriverBadgeProps {
  driverName: string;
  publicToken: string;
}

const DriverBadge = ({ driverName, publicToken }: DriverBadgeProps) => {
  // Monta a URL fixa. Ex: https://frotagest.com/drivers/qrcode/xyz-123
  const urlPerfil = `https://seusite.com/drivers/qrcode/${publicToken}`;
  
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
        downloadLink.download = `qrcode-${driverName}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="card-cracha">
      <h3>{driverName}</h3>
      
      <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
        {/* O QR Code é gerado aqui, ao vivo */}
        <QRCode 
          ref={svgRef}
          value={urlPerfil} 
          size={200} // Tamanho bom para leitura
          level="H"  // High Error Correction (bom se o adesivo arranhar)
        />
      </div>

      <p>Apresente este código</p>
      
      <button onClick={downloadQRCode}>
        Baixar Imagem para Imprimir
      </button>
    </div>
  );
};

export default DriverBadge;