import sqlite3
import json

def migrate():
    # Conectar a la DB vieja
    try:
        conn = sqlite3.connect('c:/Users/dello/OneDrive/Desktop/SISTEMAS/SISTEMA SODERIA NICO/backend/soderia.db')
        cursor = conn.cursor()
        
        # Obtener productos
        cursor.execute("SELECT name, code, price FROM product")
        products = [{"name": row[0], "code": row[1], "price": row[2]} for row in cursor.fetchall()]
        
        # Obtener clientes
        cursor.execute("SELECT name, address, phone, balance FROM client")
        clients = [{"name": row[0], "address": row[1], "phone": row[2], "balance": row[3]} for row in cursor.fetchall()]
        
        data = {
            "products": products,
            "clients": clients
        }
        
        with open('c:/Users/dello/OneDrive/Desktop/SISTEMAS/SISTEMA SODERIA NICO/soderia_next/prisma/legacy_data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"✅ Extraídos {len(products)} productos y {len(clients)} clientes.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    migrate()
