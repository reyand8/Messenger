import Men1 from '../assets/people/Men1.jpg';
import Men2 from '../assets/people/Men2.jpg';
import Men3 from '../assets/people/Men3.jpg';

import Women1 from '../assets/people/Women1.jpg';
import Women2 from '../assets/people/Women2.jpg';
import Women3 from '../assets/people/Women3.jpg';

const contacts: string[] = [
    Men1,
    Men2,
    Men3,
    Women1,
    Women2,
    Women3,
];

function getRandomContact(): string {
    const randomIndex = Math.floor(Math.random() * contacts.length);
    return contacts[randomIndex];
}

export default getRandomContact;