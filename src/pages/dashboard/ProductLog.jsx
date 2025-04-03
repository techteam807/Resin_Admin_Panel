import { BellIcon, CurrencyDollarIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Button, Card, CardBody, CardHeader, Input, Timeline, TimelineBody, TimelineConnector, TimelineHeader, TimelineIcon, TimelineItem, Typography } from '@material-tailwind/react'
import React from 'react'

const ProductLog = () => {
  return (
    <div>
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none pb-5">
        <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4">
          <div>
            <Typography variant="h5" color="blue-gray">
              Product Log
            </Typography>
            <Typography color="gray" variant='small' className="mt-1 font-normal">
              See information about product
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <div className="w-full md:w-72 relative flex gap-2">
              <Input
                label="Search"
              />
              <Button variant="gradient" className="px-2.5" size="sm">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className='border-t border-blue-gray-100'>
        <div className='px-10'>
          <ol class="relative border-s border-blue-gray-100 dark:border-gray-700 mt-5">                  
              <li class="mb-10 ms-8">            
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[#212121] rounded-full -start-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                      <HomeIcon className="h-4 w-4 text-white" />
                  </span>
                  <div class="items-center justify-between p-4 bg-white border border-blue-gray-100 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                      <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">just now</time>
                      <div class="text-sm font-normal text-gray-500 dark:text-gray-300">Bonnie moved <a href="#" class="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Jese Leos</a> to <span class="bg-gray-100 text-gray-800 text-xs font-normal me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-600 dark:text-gray-300">Funny Group</span></div>
                  </div>
              </li>
              <li class="mb-10 ms-8">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[#212121] rounded-full -start-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                      <BellIcon className="h-4 w-4 text-white" />
                  </span>
                  <div class="p-4 bg-white border border-blue-gray-100 rounded-lg shadow-xs dark:bg-gray-700 dark:border-gray-600">
                      <div class="items-center justify-between mb-3 sm:flex">
                          <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">2 hours ago</time>
                          <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">Thomas Lean commented on  <a href="#" class="font-semibold text-gray-900 dark:text-white hover:underline">Flowbite Pro</a></div>
                      </div>
                      <div class="p-3 text-xs italic font-normal text-gray-500 border border-blue-gray-100 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">Hi ya'll! I wanted to share a webinar zeroheight is having regarding how to best measure your design system! This is the second session of our new webinar series on #DesignSystems discussions where we'll be speaking about Measurement.</div>
                  </div>
              </li>
              <li class="mb-10 ms-8">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[#212121] rounded-full -start-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                      <CurrencyDollarIcon className="h-4 w-4 text-white" />
                  </span>
                  <div class="items-center justify-between p-4 bg-white border border-blue-gray-100 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                      <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">1 day ago</time>
                      <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">Jese Leos has changed <a href="#" class="font-semibold text-blue-600 dark:text-blue-500 hover:underline">Pricing page</a> task status to  <span class="font-semibold text-gray-900 dark:text-white">Finished</span></div>
                  </div>
              </li>
          </ol>
        </div>

      </CardBody>
      </Card>
      </div>
    </div>
  )
}

export default ProductLog
