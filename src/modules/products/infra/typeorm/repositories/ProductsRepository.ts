import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);

    const allProducts = await this.ormRepository.find({
      id: In(ids),
    });

    return allProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(product => product.id);

    const productsSelected = await this.ormRepository.find({
      id: In(ids),
    });

    return Promise.all(
      products.map(async product => {
        const productSelected = productsSelected.find(
          productS => productS.id === product.id,
        );

        if (
          !productSelected?.quantity ||
          productSelected.quantity < product.quantity
        ) {
          throw new AppError('less stock than requested', 400);
        }

        productSelected.quantity -= product.quantity;

        const productUpdated = await this.ormRepository.save(productSelected);

        return productUpdated;
      }),
    );
  }
}

export default ProductsRepository;
