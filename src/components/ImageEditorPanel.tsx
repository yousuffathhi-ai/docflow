import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Sliders,
  AlignLeft,
  AlignRight,
  Maximize2,
  Minimize2,
  Trash2,
  Check,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface ImageEditorPanelProps {
  imageElement: HTMLImageElement | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateContent?: () => void;
  onDeleteImage?: () => void;
}

export const ImageEditorPanel: React.FC<ImageEditorPanelProps> = ({
  imageElement,
  isOpen,
  onClose,
  onUpdateContent,
  onDeleteImage,
}) => {
  // Current image manipulation states
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [wrapMode, setWrapMode] = useState<string>('inline');
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [borderWidth, setBorderWidth] = useState<number>(0);
  const [borderColor, setBorderColor] = useState<string>('#000000');
  const [imageWidthPercent, setImageWidthPercent] = useState<number>(100);

  // Crop mode state
  const [isCropMode, setIsCropMode] = useState<boolean>(false);
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9'>('free');
  const [cropRect, setCropRect] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize state when imageElement changes
  useEffect(() => {
    if (!imageElement) return;

    // Parse existing styles if present
    const filter = imageElement.style.filter || '';
    const bMatch = filter.match(/brightness\((\d+)%\)/);
    const cMatch = filter.match(/contrast\((\d+)%\)/);
    const gMatch = filter.match(/grayscale\((\d+)%\)/);
    const sMatch = filter.match(/sepia\((\d+)%\)/);

    setBrightness(bMatch ? parseInt(bMatch[1], 10) : 100);
    setContrast(cMatch ? parseInt(cMatch[1], 10) : 100);
    setGrayscale(gMatch ? parseInt(gMatch[1], 10) : 0);
    setSepia(sMatch ? parseInt(sMatch[1], 10) : 0);

    const transform = imageElement.style.transform || '';
    const rMatch = transform.match(/rotate\((-?\d+)deg\)/);
    setRotation(rMatch ? parseInt(rMatch[1], 10) : 0);
    setFlipH(transform.includes('scaleX(-1)'));
    setFlipV(transform.includes('scaleY(-1)'));

    // Check wrap / float
    const float = imageElement.style.float;
    const zIndex = imageElement.style.zIndex;
    if (zIndex === '-1') {
      setWrapMode('behind');
    } else if (zIndex === '20') {
      setWrapMode('in-front');
    } else if (float === 'left') {
      setWrapMode('square-left');
    } else if (float === 'right') {
      setWrapMode('square-right');
    } else {
      setWrapMode('inline');
    }

    const br = parseInt(imageElement.style.borderRadius || '0', 10);
    setBorderRadius(isNaN(br) ? 0 : br);

    const bw = parseInt(imageElement.style.borderWidth || '0', 10);
    setBorderWidth(isNaN(bw) ? 0 : bw);

    setBorderColor(imageElement.style.borderColor || '#000000');
  }, [imageElement]);

  // Apply styling to imageElement whenever values change
  const applyStyles = (
    newRot = rotation,
    newFlipH = flipH,
    newFlipV = flipV,
    newB = brightness,
    newC = contrast,
    newG = grayscale,
    newS = sepia,
    newWrap = wrapMode,
    newBr = borderRadius,
    newBw = borderWidth,
    newBc = borderColor
  ) => {
    if (!imageElement) return;

    // Filters
    imageElement.style.filter = `brightness(${newB}%) contrast(${newC}%) grayscale(${newG}%) sepia(${newS}%)`;

    // Transform
    const transforms: string[] = [];
    if (newRot !== 0) transforms.push(`rotate(${newRot}deg)`);
    if (newFlipH) transforms.push('scaleX(-1)');
    if (newFlipV) transforms.push('scaleY(-1)');
    imageElement.style.transform = transforms.join(' ') || 'none';
    imageElement.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';

    // Text Wrapping / Alignment
    switch (newWrap) {
      case 'square-left':
        imageElement.style.display = 'block';
        imageElement.style.float = 'left';
        imageElement.style.margin = '0 16px 12px 0';
        imageElement.style.position = 'relative';
        imageElement.style.zIndex = '1';
        imageElement.style.opacity = '1';
        break;
      case 'square-right':
        imageElement.style.display = 'block';
        imageElement.style.float = 'right';
        imageElement.style.margin = '0 0 12px 16px';
        imageElement.style.position = 'relative';
        imageElement.style.zIndex = '1';
        imageElement.style.opacity = '1';
        break;
      case 'behind':
        imageElement.style.display = 'block';
        imageElement.style.float = 'none';
        imageElement.style.margin = '10px auto';
        imageElement.style.position = 'relative';
        imageElement.style.zIndex = '-1';
        imageElement.style.opacity = '0.75';
        break;
      case 'in-front':
        imageElement.style.display = 'block';
        imageElement.style.float = 'none';
        imageElement.style.margin = '10px auto';
        imageElement.style.position = 'relative';
        imageElement.style.zIndex = '20';
        imageElement.style.opacity = '1';
        break;
      case 'inline':
      default:
        imageElement.style.display = 'inline-block';
        imageElement.style.float = 'none';
        imageElement.style.margin = '6px';
        imageElement.style.position = 'relative';
        imageElement.style.zIndex = '1';
        imageElement.style.opacity = '1';
        break;
    }

    // Border
    imageElement.style.borderRadius = `${newBr}px`;
    if (newBw > 0) {
      imageElement.style.border = `${newBw}px solid ${newBc}`;
    } else {
      imageElement.style.border = 'none';
    }

    if (onUpdateContent) onUpdateContent();
  };

  const handleRotate = (delta: number) => {
    const next = (rotation + delta + 360) % 360;
    setRotation(next);
    applyStyles(next);
  };

  const handleToggleFlipH = () => {
    const next = !flipH;
    setFlipH(next);
    applyStyles(rotation, next);
  };

  const handleToggleFlipV = () => {
    const next = !flipV;
    setFlipV(next);
    applyStyles(rotation, flipH, next);
  };

  const handleFilterChange = (type: 'brightness' | 'contrast' | 'grayscale' | 'sepia', val: number) => {
    if (type === 'brightness') {
      setBrightness(val);
      applyStyles(rotation, flipH, flipV, val, contrast, grayscale, sepia);
    } else if (type === 'contrast') {
      setContrast(val);
      applyStyles(rotation, flipH, flipV, brightness, val, grayscale, sepia);
    } else if (type === 'grayscale') {
      setGrayscale(val);
      applyStyles(rotation, flipH, flipV, brightness, contrast, val, sepia);
    } else if (type === 'sepia') {
      setSepia(val);
      applyStyles(rotation, flipH, flipV, brightness, contrast, grayscale, val);
    }
  };

  const handleWrapChange = (mode: string) => {
    setWrapMode(mode);
    applyStyles(rotation, flipH, flipV, brightness, contrast, grayscale, sepia, mode);
  };

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setSepia(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setWrapMode('inline');
    setBorderRadius(0);
    setBorderWidth(0);
    applyStyles(0, false, false, 100, 100, 0, 0, 'inline', 0, 0, '#000000');
  };

  const handleResizePercent = (pct: number) => {
    if (!imageElement) return;
    setImageWidthPercent(pct);
    imageElement.style.maxWidth = pct === 100 ? '100%' : `${pct}%`;
    imageElement.style.width = pct === 100 ? 'auto' : `${pct}%`;
    imageElement.style.height = 'auto';
    if (onUpdateContent) onUpdateContent();
  };

  // Perform canvas-based crop
  const executeCrop = () => {
    if (!imageElement) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      // Crop coordinates in percentage of natural dimensions
      const cropX = (cropRect.x / 100) * naturalW;
      const cropY = (cropRect.y / 100) * naturalH;
      const cropW = (cropRect.width / 100) * naturalW;
      const cropH = (cropRect.height / 100) * naturalH;

      canvas.width = Math.max(1, cropW);
      canvas.height = Math.max(1, cropH);

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const croppedDataUrl = canvas.toDataURL('image/png');
      imageElement.src = croppedDataUrl;
      setIsCropMode(false);
      if (onUpdateContent) onUpdateContent();
    };
    img.src = imageElement.src;
  };

  if (!isOpen || !imageElement) return null;

  return (
    <div
      className="fixed bottom-12 right-6 z-50 w-96 bg-white border border-zinc-300 rounded-lg shadow-2xl flex flex-col overflow-hidden text-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-200"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-white select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-300" />
          <h3 className="text-xs font-semibold tracking-wide uppercase">Format Picture & Image Suite</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
        {/* Crop View Modal / Tool */}
        {isCropMode ? (
          <div className="p-3 bg-zinc-50 border border-zinc-300 rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-zinc-900">
                <Crop className="w-4 h-4" />
                Image Crop Tool
              </span>
              <button
                onClick={() => setIsCropMode(false)}
                className="text-zinc-500 hover:text-zinc-800"
              >
                Cancel
              </button>
            </div>

            {/* Crop Aspect ratio presets */}
            <div className="flex items-center gap-1.5">
              {(['free', '1:1', '4:3', '16:9'] as const).map((aspect) => (
                <button
                  key={aspect}
                  onClick={() => {
                    setCropAspect(aspect);
                    if (aspect === '1:1') {
                      setCropRect({ x: 15, y: 15, width: 70, height: 70 });
                    } else if (aspect === '4:3') {
                      setCropRect({ x: 10, y: 15, width: 80, height: 60 });
                    } else if (aspect === '16:9') {
                      setCropRect({ x: 5, y: 20, width: 90, height: 50 });
                    } else {
                      setCropRect({ x: 10, y: 10, width: 80, height: 80 });
                    }
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-medium border ${
                    cropAspect === aspect
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {aspect === 'free' ? 'Freeform' : aspect}
                </button>
              ))}
            </div>

            {/* Visual Crop Box Preview */}
            <div className="relative border border-dashed border-zinc-400 bg-zinc-200 rounded overflow-hidden aspect-video flex items-center justify-center">
              <img
                src={imageElement.src}
                alt="Crop preview"
                className="max-h-full max-w-full object-contain opacity-50"
              />
              <div
                className="absolute border-2 border-white shadow-outline bg-transparent pointer-events-none"
                style={{
                  left: `${cropRect.x}%`,
                  top: `${cropRect.y}%`,
                  width: `${cropRect.width}%`,
                  height: `${cropRect.height}%`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsCropMode(false)}
                className="px-3 py-1 bg-white border border-zinc-300 text-zinc-700 rounded hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={executeCrop}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-800"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Crop
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCropMode(true)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded font-medium text-zinc-800 transition-colors"
          >
            <Crop className="w-4 h-4" />
            Open Crop Tool
          </button>
        )}

        {/* Section 1: Rotation & Flip */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 block">
            Rotation & Flip
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleRotate(-90)}
              className="flex flex-col items-center justify-center p-2 rounded border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors"
              title="Rotate Left 90°"
            >
              <RotateCcw className="w-4 h-4 mb-1" />
              <span className="text-[10px]">-90°</span>
            </button>
            <button
              onClick={() => handleRotate(90)}
              className="flex flex-col items-center justify-center p-2 rounded border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors"
              title="Rotate Right 90°"
            >
              <RotateCw className="w-4 h-4 mb-1" />
              <span className="text-[10px]">+90°</span>
            </button>
            <button
              onClick={handleToggleFlipH}
              className={`flex flex-col items-center justify-center p-2 rounded border transition-colors ${
                flipH ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 border-zinc-300 text-zinc-800 hover:bg-zinc-100'
              }`}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Flip H</span>
            </button>
            <button
              onClick={handleToggleFlipV}
              className={`flex flex-col items-center justify-center p-2 rounded border transition-colors ${
                flipV ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 border-zinc-300 text-zinc-800 hover:bg-zinc-100'
              }`}
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Flip V</span>
            </button>
          </div>
        </div>

        {/* Section 2: Position & Text Wrapping */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 block">
            Position & Text Wrapping
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleWrapChange('inline')}
              className={`p-2 text-left rounded border text-[11px] transition-colors ${
                wrapMode === 'inline'
                  ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
              }`}
            >
              In line with text
            </button>
            <button
              onClick={() => handleWrapChange('square-left')}
              className={`p-2 text-left rounded border text-[11px] transition-colors ${
                wrapMode === 'square-left'
                  ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
              }`}
            >
              Square (Left Float)
            </button>
            <button
              onClick={() => handleWrapChange('square-right')}
              className={`p-2 text-left rounded border text-[11px] transition-colors ${
                wrapMode === 'square-right'
                  ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
              }`}
            >
              Square (Right Float)
            </button>
            <button
              onClick={() => handleWrapChange('behind')}
              className={`p-2 text-left rounded border text-[11px] transition-colors ${
                wrapMode === 'behind'
                  ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
              }`}
            >
              Behind text (Watermark)
            </button>
            <button
              onClick={() => handleWrapChange('in-front')}
              className={`col-span-2 p-2 text-left rounded border text-[11px] transition-colors ${
                wrapMode === 'in-front'
                  ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
              }`}
            >
              In front of text (Overlay)
            </button>
          </div>
        </div>

        {/* Section 3: Visual Filters */}
        <div className="space-y-3 pt-2 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Image Adjustments & Filters
            </label>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-zinc-600 hover:text-zinc-900 flex items-center gap-1 underline"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Reset All
            </button>
          </div>

          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600">Brightness</span>
              <span className="font-mono text-zinc-900">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value, 10))}
              className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600">Contrast</span>
              <span className="font-mono text-zinc-900">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value, 10))}
              className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Grayscale */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600">Grayscale (B&W)</span>
              <span className="font-mono text-zinc-900">{grayscale}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={grayscale}
              onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value, 10))}
              className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sepia */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600">Sepia / Vintage</span>
              <span className="font-mono text-zinc-900">{sepia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sepia}
              onChange={(e) => handleFilterChange('sepia', parseInt(e.target.value, 10))}
              className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Section 4: Size & Frame Styling */}
        <div className="space-y-2 pt-2 border-t border-zinc-200">
          <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 block">
            Size & Frame
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handleResizePercent(pct)}
                className={`py-1 rounded border text-center font-mono ${
                  imageWidthPercent === pct
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Corner Radius</span>
              <select
                value={borderRadius}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBorderRadius(val);
                  applyStyles(rotation, flipH, flipV, brightness, contrast, grayscale, sepia, wrapMode, val);
                }}
                className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs"
              >
                <option value={0}>Square (0px)</option>
                <option value={4}>Subtle (4px)</option>
                <option value={8}>Medium (8px)</option>
                <option value={16}>Rounded (16px)</option>
                <option value={9999}>Circle / Pill</option>
              </select>
            </div>

            <div className="flex-1">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Border Width</span>
              <select
                value={borderWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBorderWidth(val);
                  applyStyles(rotation, flipH, flipV, brightness, contrast, grayscale, sepia, wrapMode, borderRadius, val);
                }}
                className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs"
              >
                <option value={0}>None</option>
                <option value={1}>1px Solid</option>
                <option value={2}>2px Solid</option>
                <option value={4}>4px Frame</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-zinc-100 border-t border-zinc-200 flex items-center justify-between">
        {onDeleteImage && (
          <button
            onClick={onDeleteImage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Image
          </button>
        )}
        <button
          onClick={onClose}
          className="ml-auto px-4 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
