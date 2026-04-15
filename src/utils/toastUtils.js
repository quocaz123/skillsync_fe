import toast from "react-hot-toast";

export function getApiErrorMessage(err, fallback = "Có lỗi xảy ra. Vui lòng thử lại.") {
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

export function toastError(err, fallback) {
  toast.error(getApiErrorMessage(err, fallback));
}

export function toastSuccess(message) {
  toast.success(message);
}

