import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  @Exclude()
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  @Exclude()
  product: Product;

  @Column()
  product_id: string;

  @Column()
  @Exclude()
  order_id: string;

  @Expose({ name: 'price' })
  priceFormatted(): string {
    return this.price.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    });
  }

  @Column('real')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default OrdersProducts;
