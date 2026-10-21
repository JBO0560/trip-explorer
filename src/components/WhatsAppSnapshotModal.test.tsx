import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { WhatsAppSnapshotModal } from './WhatsAppSnapshotModal';
import { initialTripData } from '../data/initialTrip';
import * as htmlToImage from 'html-to-image';

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toBlob: vi.fn(),
  toPng: vi.fn()
}));

describe('WhatsAppSnapshotModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <WhatsAppSnapshotModal
        isOpen={false}
        onClose={vi.fn()}
        trip={initialTripData}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal dialog when isOpen is true with Full Route Overview by default', () => {
    render(
      <WhatsAppSnapshotModal
        isOpen={true}
        onClose={vi.fn()}
        trip={initialTripData}
      />
    );

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('WhatsApp Snapshot Card')).toBeDefined();
    // Default mode is Full Route Overview
    expect(screen.getByText('ITINERARY SNAPSHOT')).toBeDefined();
    expect(screen.getByText('Korea & Japan Discovery')).toBeDefined();
    expect(screen.getByText('Seoul')).toBeDefined();
    expect(screen.getByText('Busan')).toBeDefined();
    expect(screen.getByText('Kyoto & Osaka')).toBeDefined();
    expect(screen.getByText('Tokyo')).toBeDefined();
  });

  it('switches to City Deep-Dive mode and updates content when selecting a city', () => {
    render(
      <WhatsAppSnapshotModal
        isOpen={true}
        onClose={vi.fn()}
        trip={initialTripData}
      />
    );

    // Switch to City Deep-Dive mode
    const cityDeepDiveBtn = screen.getByRole('button', { name: /City Deep-Dive/i });
    fireEvent.click(cityDeepDiveBtn);

    // Check that city details are displayed (Seoul by default)
    expect(screen.getByText('Ryse Hotel Hongdae')).toBeDefined();
    expect(screen.getByText('Bukchon Hanok Village')).toBeDefined();

    // Change city in selector to Busan
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'busan' } });

    expect(screen.getByText('Signiel Busan (Haeundae)')).toBeDefined();
    expect(screen.getAllByText('Gamcheon Culture Village').length).toBeGreaterThan(0);
  });

  it('switches to Transit & Flights schedule view', () => {
    render(
      <WhatsAppSnapshotModal
        isOpen={true}
        onClose={vi.fn()}
        trip={initialTripData}
      />
    );

    const transitBtn = screen.getByRole('button', { name: /Transit & Flights/i });
    fireEvent.click(transitBtn);

    expect(screen.getByText('Transit & Flight Schedule')).toBeDefined();
    expect(screen.getByText('KTX 021')).toBeDefined();
    expect(screen.getByText('BX124')).toBeDefined();
    expect(screen.getByText('Nozomi 24')).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <WhatsAppSnapshotModal
        isOpen={true}
        onClose={handleClose}
        trip={initialTripData}
      />
    );

    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('executes 1-click Copy Image to Clipboard when clicked', async () => {
    const mockBlob = new Blob(['fake-image-bytes'], { type: 'image/png' });
    vi.mocked(htmlToImage.toBlob).mockResolvedValue(mockBlob);

    const clipboardWriteMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        write: clipboardWriteMock
      },
      writable: true,
      configurable: true
    });
    // Ensure ClipboardItem is defined
    (globalThis as unknown as { ClipboardItem: unknown }).ClipboardItem = class ClipboardItem {
      data: Record<string, unknown>;
      constructor(data: Record<string, unknown>) {
        this.data = data;
      }
    };

    render(
      <WhatsAppSnapshotModal
        isOpen={true}
        onClose={vi.fn()}
        trip={initialTripData}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /Copy Image to Clipboard/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(htmlToImage.toBlob).toHaveBeenCalled();
      expect(clipboardWriteMock).toHaveBeenCalled();
      expect(screen.getByRole('button', { name: /Copied Image!/i })).toBeDefined();
      expect(screen.getByText(/Image copied to clipboard! Paste directly into WhatsApp./i)).toBeDefined();
    });
  });

  it('executes 1-click Download PNG fallback', async () => {
    const mockDataUrl = 'data:image/png;base64,fakePngData';
    vi.mocked(htmlToImage.toPng).mockResolvedValue(mockDataUrl);

    // Mock anchor click
    const anchorClickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = anchorClickMock;
      }
      return el;
    });

    render(
      <WhatsAppSnapshotModal
        isOpen={true}
        onClose={vi.fn()}
        trip={initialTripData}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Download PNG/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(htmlToImage.toPng).toHaveBeenCalled();
      expect(anchorClickMock).toHaveBeenCalled();
      expect(screen.getByRole('button', { name: /Downloaded!/i })).toBeDefined();
    });
  });
});
