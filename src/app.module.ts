import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import * as path from "path";

import { NatsClientModule } from "~nats-client";
import { UserClientModule } from "~user-client";
import { RatingModule } from "~rating";
import { SellerModule } from "~seller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "i18n"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST"),
        port: configService.get<number>("POSTGRES_PORT"),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
        entities: [path.join(__dirname, "**", "*.entity{.ts,.js}")],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    NatsClientModule,
    UserClientModule,
    SellerModule,
    RatingModule,
  ],
})
export class AppModule {}
