import './Skeleton.css';

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton skeleton-card__poster" />
    <div className="skeleton-card__info">
      <div className="skeleton skeleton-card__title" />
      <div className="skeleton skeleton-card__subtitle" />
    </div>
  </div>
);

const SkeletonDetail = () => (
  <div className="skeleton-detail" aria-hidden="true">
    <div className="skeleton skeleton-detail__backdrop" />
    <div className="skeleton-detail__content">
      <div className="skeleton skeleton-detail__poster" />
      <div className="skeleton-detail__info">
        <div className="skeleton skeleton-detail__title" />
        <div className="skeleton skeleton-detail__meta" />
        <div className="skeleton skeleton-detail__text" />
        <div className="skeleton skeleton-detail__text skeleton-detail__text--short" />
      </div>
    </div>
  </div>
);

const Skeleton = ({ variant = 'card', count = 1 }) => {
  if (variant === 'detail') return <SkeletonDetail />;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
};

export default Skeleton;
