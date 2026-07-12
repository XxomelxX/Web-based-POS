import { db } from "@/lib/db"
import type {
  Category,
  Customer,
  ExpenseEntry,
  Product,
  PaymentAllocation,
  SettingEntry,
  Transaction,
  TransactionItem,
  UtangEntry,
  UtangEntryItem,
  User,
} from "@/lib/db"

export async function getUsers() {
  return await db.users.toArray()
}

export async function getActiveUsers() {
  return await db.users.where("status").equals("Active").toArray()
}

export async function getUserByUsername(username: string) {
  return await db.users.where("username").equals(username).first()
}

export async function createUser(user: User) {
  const id = await db.users.add(user)
  return { ...user, id }
}

export async function updateUser(id: number, updates: Partial<User>) {
  await db.users.update(id, updates)
}

export async function getCategories() {
  return await db.categories.toArray()
}

export async function createCategory(category: Category) {
  const id = await db.categories.add(category)
  return { ...category, id }
}

export async function updateCategory(id: number, updates: Partial<Category>) {
  await db.categories.update(id, updates)
}

export async function getProducts() {
  return await db.products.toArray()
}

export async function createProduct(product: Product) {
  const id = await db.products.add(product)
  return { ...product, id }
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  await db.products.update(id, updates)
}

export async function getSettings() {
  return await db.settings.toArray()
}

export async function getSetting(key: string) {
  return await db.settings.get(key)
}

export async function saveSetting(entry: SettingEntry) {
  await db.settings.put(entry)
}

export async function getTransactions() {
  return await db.transactions.toArray()
}

export async function createTransaction(transaction: Transaction) {
  const id = await db.transactions.add(transaction)
  return { ...transaction, id }
}

export async function createTransactionWithItems(
  transaction: Omit<Transaction, "id">,
  items: Array<Omit<TransactionItem, "id" | "transactionId">>
) {
  const id = await db.transaction(
    "rw",
    db.transactions,
    db.transactionItems,
    db.products,
    async () => {
      const transactionId = await db.transactions.add(transaction)

      await Promise.all(
        items.map(async (item) => {
          await db.transactionItems.add({
            ...item,
            transactionId,
          })

          const product = await db.products.get(item.productId)
          if (product?.id != null) {
            const newStock = Math.max(0, product.stock - item.quantity)
            await db.products.update(product.id, {
              stock: newStock,
              lowStock: newStock < 20,
            })
          }
        })
      )

      return transactionId
    }
  )

  return { ...transaction, id }
}

export async function getTransactionItems(transactionId: number) {
  return await db.transactionItems.where("transactionId").equals(transactionId).toArray()
}

export async function createTransactionItem(item: TransactionItem) {
  const id = await db.transactionItems.add(item)
  return { ...item, id }
}

export async function getCustomers() {
  return await db.customers.toArray()
}

export async function createCustomer(customer: Customer) {
  const id = await db.customers.add(customer)
  return { ...customer, id }
}

export async function updateCustomer(id: number, updates: Partial<Customer>) {
  await db.customers.update(id, updates)
}

export async function getUtangEntries() {
  return await db.utangEntries.toArray()
}

export async function createUtangEntry(entry: UtangEntry) {
  const id = await db.utangEntries.add(entry)
  return { ...entry, id }
}

export async function updateUtangEntry(id: number, updates: Partial<UtangEntry>) {
  await db.utangEntries.update(id, updates)
}

export async function getUtangEntryItems(utangEntryId: number) {
  return await db.utangEntryItems.where("utangEntryId").equals(utangEntryId).toArray()
}

export async function getAllUtangEntryItems() {
  return await db.utangEntryItems.toArray()
}

export async function createUtangEntryItem(item: UtangEntryItem) {
  const id = await db.utangEntryItems.add(item)
  return { ...item, id }
}

export async function getPaymentAllocations() {
  return await db.paymentAllocations.toArray()
}

export async function getPaymentAllocationsByPayment(paymentId: number) {
  return await db.paymentAllocations.where("paymentId").equals(paymentId).toArray()
}

export async function createPaymentAllocation(allocation: PaymentAllocation) {
  const id = await db.paymentAllocations.add(allocation)
  return { ...allocation, id }
}

export async function getExpenses() {
  return await db.expenses.toArray()
}

export async function createExpense(expense: ExpenseEntry) {
  const id = await db.expenses.add(expense)
  return { ...expense, id }
}
