import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  factory DatabaseHelper() {
    return _instance;
  }

  DatabaseHelper._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'soderia_offline.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    // 1. Cola de Sincronización (CRÍTICO)
    await db.execute('''
      CREATE TABLE sync_queue(
        uuid TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        payload TEXT NOT NULL, -- JSON
        status TEXT DEFAULT 'pending', 
        created_at TEXT
      )
    ''');

    // 2. Tablas Espejo (solo lectura offline)
    await db.execute('''
      CREATE TABLE products(
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL
      )
    ''');
    
    await db.execute('''
      CREATE TABLE clients(
        id INTEGER PRIMARY KEY,
        name TEXT,
        address TEXT
      )
    ''');
  }

  // --- Helpers Queue ---
  Future<void> addToQueue(String uuid, String action, String payload) async {
    final db = await database;
    await db.insert('sync_queue', {
      'uuid': uuid,
      'action': action,
      'payload': payload,
      'status': 'pending',
      'created_at': DateTime.now().toIso8601String()
    });
  }

  Future<List<Map<String, dynamic>>> getPendingOperations() async {
    final db = await database;
    return await db.query('sync_queue', where: 'status = ?', whereArgs: ['pending']);
  }

  Future<void> deleteFromQueue(String uuid) async {
    final db = await database;
    await db.delete('sync_queue', where: 'uuid = ?', whereArgs: [uuid]);
  }
}
