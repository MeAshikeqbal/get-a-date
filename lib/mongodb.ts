import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

interface GlobalWithMongoose {
  mongoose:
    | {
        conn: mongoose.Connection | null
        promise: Promise<mongoose.Connection> | null
      }
    | undefined
}

declare const global: GlobalWithMongoose

const cached = global.mongoose || { conn: null, promise: null }

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect

