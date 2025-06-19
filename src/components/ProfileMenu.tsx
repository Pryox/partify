import { Menu, Avatar, Text } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';

interface ProfileMenuProps {
  userData: SpotifyApi.CurrentUsersProfileResponse | null;
  onLogout: () => void;
}

export function ProfileMenu({ userData, onLogout }: ProfileMenuProps) {
  if (!userData) return null;
  console.log(userData);

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <button className="flex flex-row items-center justify-center gap-2 border border-stone-100 rounded-full p-0.5 hover:cursor-pointer hover:bg-stone-800 transition-colors">
          <p className="font-bold text-stone-100 mb-0.5 ml-3">{userData.display_name ?? ''}</p>
          <Avatar variant="outline" radius="xl" src={userData.images?.[0]?.url} />
        </button>
      </Menu.Target>

      <Menu.Dropdown className="bg-[#1A202C] border border-stone-600">
        <Menu.Label className="text-stone-400">Profile</Menu.Label>
        <Menu.Item leftSection={<IconUser size={14} />} className="text-stone-200 hover:bg-stone-700" disabled>
          <div>
            <Text size="sm" className="text-stone-200">
              {userData.display_name}
            </Text>
          </div>
        </Menu.Item>

        <Menu.Divider className="border-stone-600" />

        <Menu.Item leftSection={<IconLogout size={14} />} onClick={onLogout} className="text-stone-200 hover:bg-red-600">
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
