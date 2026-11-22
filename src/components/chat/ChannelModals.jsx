import useChatUiStore from '../../store/chatUiStore.js';
import AddChannelModal from './modals/AddChannelModal.jsx';
import RemoveChannelModal from './modals/RemoveChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';

const ChannelModals = () => {
  const activeModal = useChatUiStore((state) => state.activeModal);
  const closeModal = useChatUiStore((state) => state.closeModal);

  if (!activeModal) {
    return null;
  }

  const { type, channel } = activeModal;

  if (type === 'add') {
    return <AddChannelModal opened onClose={closeModal} />;
  }

  if (type === 'rename') {
    return <RenameChannelModal channel={channel} opened onClose={closeModal} />;
  }

  if (type === 'remove') {
    return <RemoveChannelModal channel={channel} opened onClose={closeModal} />;
  }

  return null;
};

export default ChannelModals;
