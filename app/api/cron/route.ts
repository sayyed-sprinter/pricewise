import { scrapeAmazonProduct } from "@/lib/actions/scrapper";
import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import {
  generateEmailBody,
  sendEmail,
} from "@/lib/nodemailer";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find();

    if (!products) throw new Error(`Products not found`);

    // 1. Scrape products details and update db
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrappedProduct = await scrapeAmazonProduct(
          currentProduct.url
        );

        if (!scrappedProduct)
          throw new Error(`Products not found`);

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrappedProduct.currentPrice },
        ];
        const product = {
          ...scrappedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(
            updatedPriceHistory
          ),
          averagePrice: getAveragePrice(
            updatedPriceHistory
          ),
        };

        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              url: product.url,
            },
            product
          );

        //   2. Check each product status and send email accordingly
        const emailNotifType = getEmailNotifType(
          scrappedProduct,
          currentProduct
        );
        if (
          emailNotifType &&
          updatedProduct.users.length > 0
        ) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );

          await sendEmail(emailContent, userEmails);
        }
        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "OK",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error in GET: ${error}`);
  }
}
