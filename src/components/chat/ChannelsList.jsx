import { NavLink, Stack } from '@mantine/core';

const ChannelsList = ({ channels, currentChannelId, onSelect }) => (
  <Stack gap="xs">
    {channels.map(({ id, name }) => (
      <NavLink
        key={id}
        component="button"
        label={`# ${name}`}
        active={id === currentChannelId}
        onClick={() => onSelect(id)}
      />
    ))}
  </Stack>
);

export default ChannelsList;
