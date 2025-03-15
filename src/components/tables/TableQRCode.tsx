
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table } from '@/types/restaurant';
import { QrCode, Download, Share } from 'lucide-react';

interface TableQRCodeProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string | undefined;
}

const TableQRCode: React.FC<TableQRCodeProps> = ({
  table,
  open,
  onOpenChange,
  restaurantId
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [orderUrl, setOrderUrl] = useState<string>('');
  
  useEffect(() => {
    if (table && restaurantId) {
      // Create the ordering URL that customers will access
      const baseUrl = window.location.origin;
      const orderPageUrl = `${baseUrl}/order/${restaurantId}/${table.id}`;
      setOrderUrl(orderPageUrl);
      
      // Generate QR code URL using Google Charts API
      const qrCodeApiUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(orderPageUrl)}&chs=300x300&choe=UTF-8`;
      setQrCodeUrl(qrCodeApiUrl);
    }
  }, [table, restaurantId]);
  
  const handleDownload = () => {
    // Create a temporary link to download the QR code image
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `Table-${table?.name}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for Table ${table?.name}`,
          text: 'Scan this QR code to place an order',
          url: orderUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(orderUrl);
      alert('Order URL copied to clipboard!');
    }
  };
  
  if (!table) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code for Table {table.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="border rounded p-4 bg-white">
            <img src={qrCodeUrl} alt={`QR Code for Table ${table.name}`} className="w-64 h-64" />
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            <p>Scan this QR code to place an order at Table {table.name}</p>
            <p className="mt-1 text-xs break-all">{orderUrl}</p>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:justify-center">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button 
            className="flex-1 bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
            onClick={handleShare}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableQRCode;
