'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { metaGraphQLApi } from "./Meta-GraphQL-Api"

export async function createMetaGraphQLConfig(graphql_xhr: any) {
  try {
    const config = await prisma.metaGraphQLConfig.create({
      data: {
        graphql_xhr,
        is_active: true
      }
    })
    revalidatePath('/meta-graphql-configs')
    return { success: true, data: config }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateMetaGraphQLConfig(id: string, graphql_xhr: any) {
  try {
    const config = await prisma.metaGraphQLConfig.update({
      where: { id },
      data: { graphql_xhr }
    })
    revalidatePath('/meta-graphql-configs')
    return { success: true, data: config }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function toggleMetaGraphQLConfig(id: string, is_active: boolean) {
  try {
    const config = await prisma.metaGraphQLConfig.update({
      where: { id },
      data: { is_active }
    })
    revalidatePath('/meta-graphql-configs')
    return { success: true, data: config }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteMetaGraphQLConfig(id: string) {
  try {
    await prisma.metaGraphQLConfig.delete({
      where: { id }
    })
    revalidatePath('/meta-graphql-configs')
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getMetaGraphQLConfigs() {
  try {
    const configs = await prisma.metaGraphQLConfig.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: configs }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function testMetaGraphQLConfig(id: string) {
  try {
    const rawResponse = await metaGraphQLApi({ configId: id })
    return { success: true, data: rawResponse }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}