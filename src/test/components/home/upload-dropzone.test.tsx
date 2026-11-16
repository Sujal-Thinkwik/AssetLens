import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import UploadDropzone from '@/components/home/upload-dropzone';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('@mantine/dropzone', () => {
  const Dropzone = ({ children, onDrop }: any) => (
    <div data-testid="dropzone">
      <button type="button" onClick={() => onDrop([new File(['a'], 'assets.csv', { type: 'text/csv' })])}>
        mock-drop
      </button>
      {children}
    </div>
  );

  Dropzone.Accept = ({ children }: any) => <>{children}</>;
  Dropzone.Reject = ({ children }: any) => <>{children}</>;
  Dropzone.Idle = ({ children }: any) => <>{children}</>;

  return { Dropzone };
});

describe('UploadDropzone', () => {
  it('renders supported formats and last imported file', () => {
    renderWithProviders(
      <UploadDropzone loading={false} fileName="inventory.xlsx" onDrop={vi.fn()} onReject={vi.fn()} />
    );

    expect(screen.getByText('.xlsx')).toBeInTheDocument();
    expect(screen.getByText('.csv')).toBeInTheDocument();
    expect(screen.getByText('inventory.xlsx')).toBeInTheDocument();
  });

  it('calls onDrop when file is dropped', () => {
    const onDrop = vi.fn();
    renderWithProviders(<UploadDropzone loading={false} fileName="" onDrop={onDrop} onReject={vi.fn()} />);

    screen.getAllByRole('button', { name: 'mock-drop' }).forEach(button => {
      fireEvent.click(button);
    });
    expect(onDrop).toHaveBeenCalled();
  });
});
