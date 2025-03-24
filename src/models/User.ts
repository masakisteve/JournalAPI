import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, OneToOne, BeforeInsert, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Role } from "./Role";
import { JournalEntry } from "./JournalEntry";
import { UserPreference } from "./UserPreference";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isEmailVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

    @OneToMany(() => JournalEntry, entry => entry.user)
    journalEntries: JournalEntry[];

    @OneToOne(() => UserPreference, preference => preference.user)
    preferences: UserPreference;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}