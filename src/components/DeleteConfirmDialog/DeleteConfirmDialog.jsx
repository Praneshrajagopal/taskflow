import styles from "./DeleteConfirmDialog.module.css";

export default function DeleteConfirmDialog({
  taskName,
  onCancel,
  onConfirm,
  deleting = false,
}) {
  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !deleting
        ) {
          onCancel();
        }
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >


        <div className={styles.icon}>
          !
        </div>



        <h2 id="delete-dialog-title">
          Delete Task?
        </h2>



        <p className={styles.message}>
          Are you sure you want to delete this task?
        </p>



        <div className={styles.taskBox}>

          <span className={styles.taskLabel}>
            Task
          </span>

          <strong className={styles.taskName}>
            {taskName}
          </strong>

        </div>



        <div className={styles.actions}>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>


          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className={styles.spinner}></span>
                Deleting...
              </>
            ) : (
              "Delete Task"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}