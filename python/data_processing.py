import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="VapeStore"
    )
    return connection

def process_sales():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM Sales") 
    sales_data = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return sales_data

def add_sale(NomLiquide, NbrFlaconSale, PriceLiquide):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  
    cursor.execute("SELECT PriceUnit FROM StockLiquide WHERE NomLiquide = %s", (NomLiquide,))
    stock_data = cursor.fetchone()

    if stock_data is None:
        cursor.close()
        connection.close()
        return {"error": "NomLiquide does not exist in StockLiquide"}, 400

    PriceUnit = stock_data['PriceUnit']  
    try:
        PriceUnit = float(PriceUnit)
        PriceLiquide = float(PriceLiquide)  
    except ValueError:
        cursor.close()
        connection.close()
        return {"error": "Invalid price values"}, 400

    TotalSales = NbrFlaconSale * PriceLiquide
    ProfitSales = (PriceLiquide - PriceUnit) * NbrFlaconSale

    query = """
    INSERT INTO Sales (NomLiquide, NbrFlaconSale, PriceLiquide, TotalSales, PriceUnitSales, ProfitSales)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (NomLiquide, NbrFlaconSale, PriceLiquide, TotalSales, PriceUnit, ProfitSales))

    connection.commit()
    cursor.close()
    connection.close()

    return {
        "message": "Product added successfully",
        "TotalSales": TotalSales,
        "PriceUnitSales": PriceUnit,
        "ProfitSales": ProfitSales
    }

def selectLiquide():
    connection =get_db_connection()
    cursor=connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM StockLiquide')
    queryLiquide= cursor.fetchall()
    cursor.close()
    connection.close()
    return queryLiquide

def selectVape():
    connection=get_db_connection()
    cursor=connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM SalesVapes')
    queryVape=cursor.fetchall()
    cursor.close()
    connection.close()
    return queryVape
def selectVapeById(ID_SalesVapes):
    connection=get_db_connection()
    cursor=connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM SalesVapes WHERE ID_SalesVapes = %s',(ID_SalesVapes,))
    queryVape=cursor.fetchone()
    cursor.close()
    connection.close()
    return queryVape