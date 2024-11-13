const contacts: string[] = [
    'https://randomuser.me/api/portraits/women/33.jpg',
    'https://randomuser.me/api/portraits/women/23.jpg',
    'https://randomuser.me/api/portraits/women/30.jpg',
    'https://randomuser.me/api/portraits/women/39.jpg',
    'https://randomuser.me/api/portraits/women/20.jpg',

    'https://randomuser.me/api/portraits/men/23.jpg',
    'https://randomuser.me/api/portraits/men/16.jpg',
    'https://randomuser.me/api/portraits/men/20.jpg',
    'https://randomuser.me/api/portraits/men/17.jpg',
    'https://randomuser.me/api/portraits/men/14.jpg',
];

function getRandomContact(): string {
    const randomIndex = Math.floor(Math.random() * contacts.length);
    return contacts[randomIndex];
}

export default getRandomContact;