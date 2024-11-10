import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DrizzleService } from 'src/database/drizzle.service';
import { databaseSchema } from 'src/database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ArticlesService {

  constructor(
    private readonly drizzleService: DrizzleService
  ) { }

  async create(article: CreateArticleDto) {
    const createdArticles = await this.drizzleService.db
      .insert(databaseSchema.articles)
      .values(article)
      .returning();

    return createdArticles.pop();
  }

  getAll() {
    return this.drizzleService.db.select().from(databaseSchema.articles);
  }

  async getById(id: number) {
    const articles = await this.drizzleService.db
      .select()
      .from(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id));
    const article = articles.pop();
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  async update(id: number, article: UpdateArticleDto) {
    const updatedArticles = await this.drizzleService.db
      .update(databaseSchema.articles)
      .set(article)
      .where(eq(databaseSchema.articles.id, id))
      .returning();
 
    if (updatedArticles.length === 0) {
      throw new NotFoundException();
    }
 
    return updatedArticles.pop();
  }

  async delete(id: number) {
    const deletedArticles = await this.drizzleService.db
      .delete(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id))
      .returning();
 
    if (deletedArticles.length === 0) {
      throw new NotFoundException();
    }
  }

  
  // create(createArticleDto: CreateArticleDto) {
  //   return 'This action adds a new article';
  // }

  // findAll() {
  //   return `This action returns all articles`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} article`;
  // }

  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   return `This action updates a #${id} article`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} article`;
  // }
}
