import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * elena
 * custom hook for handling delete operations with confirmation
 * provides consistent ux for all delete actions in admin dashboard
 */
export function useDeleteConfirmation<T>(
  deletefunction: (id: number) => Promise<boolean | void>,
  onSuccess: () => void,
  entityType: string
) {
  const [isDeleting, setIsDeleting] = useState(false);
  /*handles delete with user confirmation*/
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sude you want to delete ${entityType.toLowerCase()} "${name}"?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await deletefunction(id);
      toast.success(`${entityType} deleted successfully`);
      onSuccess();
    } catch (err) {
      console.error(`Error deleting ${entityType}:`, err);
      toast.error(`Failed to delete ${entityType}`);
    } finally {
      setIsDeleting(false);
    }
  };
  return { handleDelete, isDeleting };
}