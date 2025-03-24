import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity('user_preferences')
export class UserPreference {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'light' })
    theme: string;

    @Column({ default: 'en' })
    language: string;

    @Column({ default: true })
    emailNotifications: boolean;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}