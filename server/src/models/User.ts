import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '../config/db';
import {IUserAttributes} from "../types/user.interface";


interface UserCreationAttributes extends Optional<IUserAttributes, 'id'> {}

class User extends Model<IUserAttributes, UserCreationAttributes> implements IUserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
}

User.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING, unique: true, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
    }
);



interface MessageAttributes {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    imagePaths?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: number;
    public text!: string;
    public senderId!: number;
    public receiverId!: number;
    public imagePaths?: string[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Message.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        text: { type: DataTypes.STRING, allowNull: false },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        imagePaths: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'messages',
        timestamps: true,
    }
);

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export { User, Message };