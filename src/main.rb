require 'sinatra'

# static files

set :public_folder, __dir__ + '/../public'

# default routes which show html

get '/' do
  erb :index, :layout => :layout
end

get '/create' do
  erb :create_simple, :layout => :layout
end

get '/create/advanced' do
  erb :create_advanced, :layout => :layout
end

get '/p/:id' do
  'submit an answer for ' + params['id']
end

get '/poll/:id' do
  erb :poll, :layout => :layout
end

get '/r/:id' do
  'see poll results for ' + params['id']
end

get '/results/:id' do
  erb :result, :layout => :layout
end


# api routes

post '/api/create' do

end

get '/api/p/:id' do

end

get '/api/poll/:id' do

end

post '/api/p/:id' do

end

post '/api/poll/:id' do

end

get '/api/r/:id' do

end

get '/api/results/:id' do

end