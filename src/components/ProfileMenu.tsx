import { Menu, Avatar, Text } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';

interface ProfileMenuProps {
  userData: SpotifyApi.CurrentUsersProfileResponse | null;
  onLogout: () => void;
}

export function ProfileMenu({ userData, onLogout }: ProfileMenuProps) {
  if (!userData) return null;

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <button className="flex flex-row items-center justify-center gap-2 border border-[#404040] rounded-full p-0.5 hover:cursor-pointer hover:bg-[#282828] hover:border-[#535353] transition-colors">
          <p className="font-bold text-[#ffffff] mb-0.5 ml-3">{userData.display_name ?? ''}</p>
          <Avatar variant="outline" radius="xl" src={userData.images?.[0]?.url} />
        </button>
      </Menu.Target>

      <Menu.Dropdown className="bg-[#181818] border border-[#404040]">
        <Menu.Label className="text-[#b3b3b3]">Profile</Menu.Label>
        <Menu.Item leftSection={<IconUser size={14} />} className="text-[#ffffff] hover:bg-[#282828]" disabled>
          <div>
            <Text size="sm" className="text-[#ffffff]">
              {userData.display_name}
            </Text>
          </div>
        </Menu.Item>

        <Menu.Divider className="border-[#404040]" />

        <Menu.Item leftSection={<IconLogout size={14} />} onClick={onLogout} className="text-[#ffffff] hover:bg-red-600">
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
