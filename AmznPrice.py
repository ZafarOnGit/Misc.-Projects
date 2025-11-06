import requests
from bs4 import BeautifulSoup

def get_amazon_ae_price():
    url = "https://www.amazon.ae/s?k=logitech+g+pro+x+superlight"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        print("Fetching Amazon.ae price...")
        resp = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        price = None
        for price_span in soup.find_all("span", {"class": "a-price-whole"}):
            whole = price_span.text.strip()
            fraction_span = price_span.find_next("span", {"class": "a-price-fraction"})
            fraction = fraction_span.text.strip() if fraction_span else "00"
            price = f"{whole}.{fraction}"
            break
        print(f"Amazon.ae price found: {price if price else 'Not found'}")
        return price
    except Exception as e:
        print(f"Error fetching Amazon.ae price: {e}")
        return None

def get_noon_com_price():
    url = "https://www.noon.com/uae-en/search/?q=logitech%20g%20pro%20x%20superlight"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        print("Fetching Noon.com price...")
        resp = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        price = None
        for div in soup.find_all("div", {"data-qa": "product-price"}):
            price = div.text.strip()
            break
        print(f"Noon.com price found: {price if price else 'Not found'}")
        return price
    except Exception as e:
        print(f"Error fetching Noon.com price: {e}")
        return None

def main():
    import time
    print("Starting price tracker. Press Ctrl+C to stop.")
    while True:
        print("\nChecking prices...")
        amazon_price = get_amazon_ae_price()
        noon_price = get_noon_com_price()
        print(f"Amazon.ae Logitech G502 price: {amazon_price if amazon_price else 'Not found'}")
        print(f"Noon.com Logitech G502 price: {noon_price if noon_price else 'Not found'}")
        print("---")
        time.sleep(30)  # Wait for 30 seconds

if __name__ == "__main__":
    main()