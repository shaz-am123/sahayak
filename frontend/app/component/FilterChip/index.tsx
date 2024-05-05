import styles from "./styles.module.scss";
interface FilterChipProps {
  label: string;
  value: {
    id: string;
    name: string;
  };
  removeFilter: (id: string) => void;
}
export default function FilterChip({
  label,
  value,
  removeFilter,
}: FilterChipProps) {
  return (
    <span className={styles.filterChip}>
      {label}: {value.name}
      <i
        data-testid="close-icon"
        className={`${styles.filterChipCloseIcon} pi pi-times-circle`}
        onClick={() => removeFilter(value.id)}
      />
    </span>
  );
}
