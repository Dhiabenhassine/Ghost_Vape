from flask import Flask, jsonify, request
import data_processing

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    data = data_processing.process_data()
    return jsonify(data)

@app.route('/name', methods=['GET'])
def get_name():
    name = data_processing.process_name()
    return jsonify(name)

@app.route('/sales', methods=['GET'])
def get_sales():
    sales = data_processing.process_sales()
    return jsonify(sales)

@app.route('/add_sale', methods=['POST'])
def add_sale():
    data = request.json
    NomLiquide = data.get('NomLiquide')
    NbrFlaconSale = data.get('NbrFlaconSale')
    PriceLiquide = data.get('PriceLiquide')

    if None in [NomLiquide, NbrFlaconSale, PriceLiquide]:
        return jsonify({"error": "Invalid input"}), 400

    result = data_processing.add_sale(NomLiquide, NbrFlaconSale, PriceLiquide)
    return jsonify(result)
@app.route('/liquide',methods=['GET'])
def getLiquide():
    data=data_processing.selectLiquide()
    return jsonify(data)
@app.route('/vape',methods=['GET'])
def getVape():
    vape=data_processing.selectVape()
    return jsonify(vape)
@app.route('/vape/<int:ID_SalesVapes>',methods=['GET'])
def getvape(ID_SalesVapes):
    data=data_processing.selectVapeById(ID_SalesVapes)
    if data is None:
        return jsonify({"error": "Vape sale not found"}), 404
    return jsonify(data)
if __name__ == '__main__':
    app.run(port=5000)
