import './RefreshMenu.css';

interface RefreshMenuProps {
  quality: number;
  setQuality: (q: number) => void;
  auto: boolean;
  setAuto: (a: boolean) => void;
  onRefresh: () => void;
  onClose: () => void;
}

export const RefreshMenu = ({
  quality,
  setQuality,
  auto,
  setAuto,
  onRefresh,
  onClose,
}: RefreshMenuProps) => {
  const qualities = [30, 50, 80, 90, 100];

  return (
    <div className="screen-RefreshMenu" onClick={(e) => e.stopPropagation()}>
      <div
        className={`item ${auto ? 'active' : ''}`}
        onClick={() => {
          setAuto(true);
          onClose();
        }}
      >
        Auto
      </div>
      <div className="divider" />
      {qualities.map((q) => (
        <div
          key={q}
          className={`item ${quality === q ? 'active' : ''} ${auto ? 'dimmed' : ''}`}
          onClick={() => {
            setQuality(q);
            setAuto(false);
            onClose();
          }}
        >
          {q}%
        </div>
      ))}
      <div className="divider" />
      <div
        className="item refresh"
        onClick={() => {
          onRefresh();
          onClose();
        }}
      >
        Refresh
      </div>
    </div>
  );
};
