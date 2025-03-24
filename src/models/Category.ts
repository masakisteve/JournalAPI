import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { JournalEntry } from "./JournalEntry";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => JournalEntry, entry => entry.category)
    entries: JournalEntry[];
}