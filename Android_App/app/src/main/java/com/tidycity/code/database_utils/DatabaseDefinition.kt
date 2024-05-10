package com.tidycity.code.database_utils

import android.content.Context
import androidx.room.*
import androidx.room.migration.AutoMigrationSpec

@TypeConverters(value = [RoomTypeConverters::class])
@Database(
    entities = [VideoStructure::class, FrameStructure::class, UserStructure::class,
        CredentialStructure::class],
    version = 3,
//    autoMigrations = [
//        AutoMigration(
//            from = 2, to = 3,
//            spec = DatabaseDefinition.MigrateOldToNew::class
//        )
//    ]
)


abstract class DatabaseDefinition : RoomDatabase() {
    abstract fun daoVideoMethods(): VideoMethods
    abstract fun daoUserMethods(): UserMethods
    abstract fun daoCredentialsMethods(): CredentialMethods

    // define class to migrate database
    class MigrateOldToNew : AutoMigrationSpec

    companion object {
        @Volatile
        private var INSTANCE: DatabaseDefinition? = null

        fun getDatabase(context: Context): DatabaseDefinition {
            // if the INSTANCE is not null, then return it,
            // if it is, then create the database
            if (INSTANCE == null) {
                synchronized(this) {
                    // Pass the database to the INSTANCE
                    INSTANCE = buildDatabase(context)
                }
            }
            // Return database.
            return INSTANCE!!
        }

        private fun buildDatabase(context: Context): DatabaseDefinition {
            return Room.databaseBuilder(
                context.applicationContext,
                DatabaseDefinition::class.java,
                "files.db"
            ).fallbackToDestructiveMigration().allowMainThreadQueries().build()
        }
    }
}