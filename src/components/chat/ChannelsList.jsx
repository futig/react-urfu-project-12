import { ActionIcon, Group, Menu, NavLink, Stack, Text } from '@mantine/core';

const ChannelsList = ({
  channels,
  currentChannelId,
  onSelect,
  onRename,
  onRemove,
}) => (
  <Stack gap="xs">
    {channels.map((channel) => {
      const { id, name, removable } = channel;
      const channelName = `# ${name}`;

      return (
        <Group key={id} gap={4} wrap="nowrap">
          <NavLink
            component="button"
            type="button"
            label={<Text truncate="end" title={channelName}>{channelName}</Text>}
            active={id === currentChannelId}
            onClick={() => onSelect(id)}
            flex={1}
            miw={0}
          />
          {removable && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon
                  type="button"
                  variant="subtle"
                  aria-label={`Управление каналом ${name}`}
                >
                  <span aria-hidden="true">⋮</span>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => onRename(channel)}>
                  Переименовать
                </Menu.Item>
                <Menu.Item color="red" onClick={() => onRemove(channel)}>
                  Удалить
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      );
    })}
  </Stack>
);

export default ChannelsList;
