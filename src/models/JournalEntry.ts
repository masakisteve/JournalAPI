import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Tag } from "./Tag";

@Entity('journal_entries')
export class JournalEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    mood: string;

    @Column('int')
    wordCount: number;

    @Column({ type: 'timestamp' })
    entryDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.journalEntries)
    user: User;

    @ManyToOne(() => Category, category => category.entries)
    category: Category;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];
}